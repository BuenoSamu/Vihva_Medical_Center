import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "./firebaseConfig";
import { collection, getDocs, query, orderBy, startAt, endAt, doc, getDoc, where, updateDoc, arrayUnion } from "firebase/firestore";
import './Medicamentos.css';
import moment from 'moment';
import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import 'moment/locale/pt-br';
import calendario from './calendario.png';

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [medicoId, setMedicoId] = useState(null);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null); // Novo estado para paciente selecionado
  const [aviso, setAviso] = useState(null); // Novo estado para aviso
  const dataAtual = moment().format('DD [de] MMMM');

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const medicamentosRef = collection(db, "remedios");
        let queryRef;

        if (searchTerm !== '') {
          const searchTermLower = searchTerm.toLowerCase();
          queryRef = query(
            medicamentosRef,
            orderBy("nomeLowerCase"),
            startAt(searchTermLower),
            endAt(searchTermLower + '\uf8ff')
          );
        } else {
          queryRef = query(medicamentosRef);
        }

        const querySnapshot = await getDocs(queryRef);
        const medicamentosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          Url: doc.data().Url,
          nomecomercial: doc.data().nomecomercial,
          administracao: doc.data().administracao,
          efeitoscolaterais: doc.data().efeitoscolaterais,
          tipo: doc.data().tipo,
          descricao: doc.data().descricao
        }));
        setMedicamentos(medicamentosData);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentos();
  }, [searchTerm]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setMedicoId(user.uid);
        fetchPacientes(user.uid);
      } else {
        setMedicoId(null);
        setPacientes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPacientes = async (medicoId) => {
    try {
      const medicoDoc = await getDoc(doc(db, 'medicos', medicoId));
      if (medicoDoc.exists()) {
        const medicoData = medicoDoc.data();

        if (medicoData.pacientes && medicoData.pacientes.length > 0) {
          const pacientesSnapshot = await Promise.all(
            medicoData.pacientes.map(async (pacienteUid) => {
              const pacienteDoc = await getDocs(query(collection(db, 'clientes'), where('uid', '==', pacienteUid)));
              if (!pacienteDoc.empty) {
                const pacienteData = pacienteDoc.docs[0].data();
                let pacienteRemedios = [];
                if (pacienteData.remedios && pacienteData.remedios.length > 0) {
                  pacienteRemedios = await fetchRelatedData('remedios', pacienteData.remedios);
                }
                return { id: pacienteDoc.docs[0].id, ...pacienteData, remedios: pacienteRemedios };
              }
              return null;
            })
          );

          setPacientes(pacientesSnapshot.filter(paciente => paciente !== null));
        } else {
          setPacientes([]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    }
  };

  const fetchRelatedData = async (collectionName, ids) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await Promise.all(
        ids.map(id => getDoc(doc(collectionRef, id)))
      );
      return querySnapshot.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
      return [];
    }
  };

  const atualizarPerfilMedico = async (medicoId, pacienteUid) => {
    try {
      const medicoDocRef = doc(db, 'medicos', medicoId);
      await updateDoc(medicoDocRef, {
        pacientes: arrayUnion(pacienteUid)
      });
      await fetchPacientes(medicoId);
    } catch (error) {
      console.error("Erro ao atualizar o perfil do médico:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (medicamento) => {
    setSelectedMedicamento(medicamento);
  };



  const handleSelecionarPaciente = (event) => {
    const pacienteId = event.target.value;
    setPacienteSelecionado(pacienteId);
    setAviso(null); // Limpa o aviso ao selecionar um novo paciente
  };

  const handleAdicionarRemedio = async () => {
    if (!pacienteSelecionado) {
      setAviso("Selecione um paciente antes de adicionar o remédio.");
      return; // Se nenhum paciente estiver selecionado, retorna sem fazer nada
    }

    if (!selectedMedicamento) {
      setAviso("Selecione um medicamento antes de adicionar.");
      return;
    }

    try {
      const pacienteDoc = doc(db, 'clientes', pacienteSelecionado);
      const pacienteSnap = await getDoc(pacienteDoc);
      if (pacienteSnap.exists()) {
        const pacienteData = pacienteSnap.data();
        const remediosArray = pacienteData.remedios ?? [];
        if (remediosArray.includes(selectedMedicamento.id)) {
          setAviso("Este remédio já foi adicionado para este paciente.");
        } else {
          await updateDoc(pacienteDoc, {
            remedios: arrayUnion(selectedMedicamento.id)
          });
          setAviso("Remédio adicionado com sucesso!");
        }
      } else {
        console.error("Paciente não encontrado");
        setAviso("Paciente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao adicionar remédio:", error);
      setAviso("Erro ao adicionar remédio.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="medicamentos-container">
        <table className="medicamentos-table">
          <thead>
            <tr>
              <th colSpan="3" scope="row">
                <div className='header-wrapper'>
                  <h1 className='TitleDash'>Área de medicação</h1>
                  <div className='secaoDireita'>
                    <span className="dataMed">
                      <img className="imgData" src={calendario} alt="Calendário" />
                      <h3 className='textData'>{dataAtual}</h3>
                    </span>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th colSpan="2">
                <p className='descDashMed'>Adicione remédios aos seus pacientes!</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "1%" }}>
                <div className="containerMed">
                  <div className="search-bar-container">
                    <input
                      type="text"
                      placeholder="Pesquisar medicamentos..."
                      className="search-bar-input"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div className="lista-medicamentos">
                    {medicamentos.map(medicamento => (
                      <div key={medicamento.id} className="medicamento-card" onClick={() => handleCardClick(medicamento)}>
                        {medicamento.Url && <img src={medicamento.Url} alt={medicamento.nome} className="medicamento-imagem" />}
                        <p className="medicamento-nome">{medicamento.nome}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='containerMedPac'>
                  <h3 className='textPacAdd'>Seus Pacientes</h3>
                  <div className='containerscrollPacientes'>
                    {pacientes.map(paciente => (
                      <div key={paciente.id} className='paciente-cardMed'>
                        <Link to={`/PerfilPaciente/${paciente.id}`}>
                        <div className="row">
                          {paciente.imageUrl && <img src={paciente.imageUrl} alt={`${paciente.nome} ${paciente.sobrenome}`} className='paciente-imagem' />}
                          <p className='pacienteNomeRemedios'>{paciente.nome} {paciente.sobrenome}</p>
                          </div>
                          <ul className="listaRemediosPac">
                            {paciente.remedios && paciente.remedios.map((remedio, index) => (
                            <li key={index}>
                              <p style={{textAlign: "center"}}>{remedio.nome}</p>
                              {remedio.Url && <img className="imgRemedioPac" src={remedio.Url} alt={remedio.nome} />}
                            </li>
                            ))}
                          </ul>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td>
                {selectedMedicamento && (
                  <div className="medicamento-detalhes-container">
                    <h1>{selectedMedicamento.nome}</h1>
                    {selectedMedicamento.Url && <img className="imgDescRemedio" src={selectedMedicamento.Url} alt={selectedMedicamento.nome} />}
                    {selectedMedicamento.nomecomercial && <p className="textDescRemedio"><span style={{color: "#60AD9C"}}>Nome Comercial:</span> {selectedMedicamento.nomecomercial}</p>}
                    {selectedMedicamento.administracao && <p className="textDescRemedio"><span style={{color: "#60AD9C"}}>Administração:</span> {selectedMedicamento.administracao}</p>}
                    {selectedMedicamento.efeitoscolaterais && <p className="textDescRemedio"><span style={{color: "#60AD9C"}}>Efeitos Colaterais:</span> {selectedMedicamento.efeitoscolaterais}</p>}
                    {selectedMedicamento.tipo && <p className="textDescRemedio"><span style={{color: "#60AD9C"}}>Tipo:</span> {selectedMedicamento.tipo}</p>}
                    <h3 className="titleDescMed">Descrição</h3>
                    {selectedMedicamento.descricao && <p className="textDescRemedio">{selectedMedicamento.descricao}</p>}

                    {/* Novo painel para seleção de paciente e adição de medicamento */}
                    <div className="custom-select">
                    <h4 className="titleSelectMed" htmlFor="paciente">Selecione um paciente</h4>
                    <select id="paciente" value={pacienteSelecionado ?? ""} onChange={handleSelecionarPaciente}>
                    <option value="">Selecionar pacientes</option>
                     {pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.id}>
                      {paciente.nome} {paciente.sobrenome}
                    </option>
                    ))}
                    </select>
                  </div>
                {/* Botão para adicionar remédio */}
                {pacienteSelecionado && (
                <div>
                  <button className="buttonAddRemedio" onClick={handleAdicionarRemedio}>Adicionar Remédio</button>
                  {aviso && <p>{aviso}</p>}
                </div>
                )}
                </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Medicamentos;

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "./firebaseConfig";
import { collection, getDocs, query, orderBy, startAt, endAt, doc, getDoc, where, updateDoc, arrayUnion } from "firebase/firestore";
import './Medicamentos.css';
import './Doencas.css'
import { motion } from 'framer-motion'; 
import moment from 'moment';

import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import 'moment/locale/pt-br';
import calendario from './calendario.png';

const Doencas = () => {
  const [doencas, setDoencas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [medicoId, setMedicoId] = useState(null);
  const [selectedDoenca, setSelectedDoenca] = useState(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const dataAtual = moment().format('DD [de] MMMM');
  const loginOpacityAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.1,
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    const fetchDoencas = async () => {
      try {
        const doencasRef = collection(db, "doenca");
        let queryRef;

        if (searchTerm !== '') {
          const searchTermLower = searchTerm.toLowerCase();
          queryRef = query(
            doencasRef,
            orderBy("nomeLowerCase"),
            startAt(searchTermLower),
            endAt(searchTermLower + '\uf8ff')
          );
        } else {
          queryRef = query(doencasRef);
        }

        const querySnapshot = await getDocs(queryRef);
        const doencasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          Url: doc.data().Url,
          nomecomercial: doc.data().nomecomercial,
          administracao: doc.data().administracao,
          efeitoscolaterais: doc.data().efeitoscolaterais,
          tipo: doc.data().tipo,
          descricao: doc.data().descricao
        }));
        setDoencas(doencasData);
      } catch (error) {
        console.error("Erro ao buscar doenças:", error);
      }
    };

    fetchDoencas();
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
                        const pacienteDoc = await getDoc(doc(db, 'clientes', pacienteUid));
                        if (pacienteDoc.exists()) {
                            const pacienteData = pacienteDoc.data();
                            let pacienteDoencas = [];
                            if (pacienteData.doenca && pacienteData.doenca.length > 0) {
                                pacienteDoencas = await fetchRelatedData('doenca', pacienteData.doenca);
                            }
                            return { id: pacienteDoc.id, ...pacienteData, doencas: pacienteDoencas };
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

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (doenca) => {
    setSelectedDoenca(doenca);
  };

  const handleSelecionarPaciente = (event) => {
    const pacienteId = event.target.value;
    setPacienteSelecionado(pacienteId);
    setAviso(null); // Limpa o aviso ao selecionar um novo paciente
  };

  const handleAdicionarDoenca = async () => {
    if (!pacienteSelecionado) {
      setAviso("Selecione um paciente antes de adicionar a doença.");
      return;
    }

    if (!selectedDoenca) {
      setAviso("Selecione uma doença antes de adicionar.");
      return;
    }

    try {
      const pacienteDoc = doc(db, 'clientes', pacienteSelecionado);
      const pacienteSnap = await getDoc(pacienteDoc);
      if (pacienteSnap.exists()) {
        const pacienteData = pacienteSnap.data();
        const doencasArray = pacienteData.doenca ?? [];
        if (doencasArray.includes(selectedDoenca.id)) {
          setAviso("Esta doença já foi adicionada para este paciente.");
        } else {
          await updateDoc(pacienteDoc, {
            doenca: arrayUnion(selectedDoenca.id)
          });
          setAviso("Doença adicionada com sucesso!");
        }
      } else {
        console.error("Paciente não encontrado");
        setAviso("Paciente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao adicionar doença:", error);
      setAviso("Erro ao adicionar doença.");
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial="hidden"
        animate="show"
        variants={loginOpacityAnimation}
        className='principal-container'
      >
      <div className="medicamentos-container">
        <table className="medicamentos-table">
          <thead>
            <tr>
              <th colSpan="3" scope="row">
                <div className='header-wrapper'>
                  <h1 className='TitleDash'>Área de diagnósticos</h1>
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
                <p className='descDashMed'>Diagnostique os seus pacientes!</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "1%" }}>
                <div className="containerMed">
                  <div className="search-bar-container" style={{padding: "0"}} >
                    <input
                      type="text"
                      placeholder="Pesquisar enfermidades..."
                      className="searchDoencas"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div className="lista-medicamentos">
                    {doencas.map(doenca => (
                      <div key={doenca.id} className="diagnostico-card" onClick={() => handleCardClick(doenca)}>
                        {doenca.Url && <img src={doenca.Url} alt={doenca.nome} className="diagnostico-imagem" />}
                        <p className="dianostico-nome">{doenca.nome}</p>
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
                            {paciente.doencas && paciente.doencas.map((doenca, index) => (
                              <li className="img-container" key={index}>
                                <p className="nomedoencaPac" style={{textAlign: "center"}}>{doenca.nome}</p>
                                {doenca.Url && <img className="imgDiagnosticoPac" src={doenca.Url} alt={doenca.nome}/>}
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
                {selectedDoenca && (
                  <div className="diagnostico-detalhes-container">
                    <h1 style={{color: '#6096a8'}}>{selectedDoenca.nome}</h1>
                    {selectedDoenca.Url && <img className="imgDescDiagnostico" src={selectedDoenca.Url} alt={selectedDoenca.nome} />}
                    {selectedDoenca.nomecomercial && <p className="textDescRemedio"><span style={{color: "#6096a8"}}>Nome Comercial:</span> {selectedDoenca.nomecomercial}</p>}
                    {selectedDoenca.tipo && <p className="textDescRemedio"><span style={{color: "#6096a8"}}>Tipo:</span> {selectedDoenca.tipo}</p>}
                    <h3 className="titleDescMed" style={{color: "#6096a8"}}>Descrição</h3>
                    {selectedDoenca.descricao && <p className="textDescRemedio">{selectedDoenca.descricao}</p>}

                    {/* Novo painel para seleção de paciente e adição de medicamento */}
                    <div className="custom-select">
                      <h4 className="titleSelectMed" htmlFor="paciente" style={{color: "#6096a8"}}>Selecione um paciente</h4>
                      <select id="paciente" value={pacienteSelecionado ?? ""} onChange={handleSelecionarPaciente} style={{border:"2px solid #6096a8"}}>
                        <option value="">Selecionar pacientes</option>
                        {pacientes.map(paciente => (
                          <option key={paciente.id} value={paciente.id}>
                            {paciente.nome} {paciente.sobrenome}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Botão para adicionar doença */}
                    {pacienteSelecionado && (
                      <div>
                        <button className="buttonLogin" onClick={handleAdicionarDoenca} style={{marginTop: "20px"}}>Adicionar Doença</button>
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
      </motion.div>
    </>
  );
};

export default Doencas;

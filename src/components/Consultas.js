import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import Navbar from "./Navbar";
import { auth } from "./firebaseConfig";

const AdicionarLembrete = () => {
  const [lembrete, setLembrete] = useState({ titulo: "", descricao: "", data: "" });
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    const fetchPacientesCompletos = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const medicoUid = user.uid;
          const medicoDoc = await getDoc(doc(db, 'medicos', medicoUid));
          if (medicoDoc.exists()) {
            const medicoData = medicoDoc.data();
            const pacientesIds = medicoData.pacientes ?? [];
            const pacientesPromises = pacientesIds.map(async (pacienteId) => {
              const pacienteDoc = await getDoc(doc(db, 'clientes', pacienteId));
              if (pacienteDoc.exists()) {
                const pacienteData = pacienteDoc.data();
                return { id: pacienteId, nome: pacienteData.nome, sobrenome: pacienteData.sobrenome };
              }
              return null;
            });
            const pacientesCompletos = await Promise.all(pacientesPromises);
            setPacientes(pacientesCompletos.filter(paciente => paciente !== null));
          } else {
            console.error("Médico não encontrado");
          }
        } else {
          console.error("Usuário não autenticado");
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    };

    fetchPacientesCompletos();
  }, []);

  const handleSelecionarPaciente = (event) => {
    const pacienteId = event.target.value;
    setPacienteSelecionado(pacienteId);
    setAviso(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLembrete((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAdicionarLembrete = async () => {
    if (!pacienteSelecionado) {
      setAviso("Selecione um paciente antes de adicionar o lembrete.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const medicoUid = user.uid;

        // Recuperar o nome do médico
        const medicoDoc = await getDoc(doc(db, 'medicos', medicoUid));
        let medicoNome = '';
        if (medicoDoc.exists()) {
          const medicoData = medicoDoc.data();
          medicoNome = `${medicoData.nome} ${medicoData.sobrenome}`;
        }

        // Convertendo a data para Timestamp
        const dataTimestamp = Timestamp.fromDate(new Date(lembrete.data));

        // Adiciona o lembrete na subcoleção "eventos" do documento do paciente
        await addDoc(collection(doc(db, 'clientes', pacienteSelecionado), 'eventos'), {
          medicoUid: medicoUid,
          medicoNome: medicoNome, // Adiciona o nome do médico
          titulo: lembrete.titulo,
          descricao: lembrete.descricao,
          data: dataTimestamp // Salva o Timestamp no Firestore
        });

        setAviso("Lembrete adicionado com sucesso!");
      } else {
        console.error("Usuário não autenticado");
        setAviso("Erro: Usuário não autenticado.");
      }
    } catch (error) {
      console.error("Erro ao adicionar lembrete:", error);
      setAviso("Erro ao adicionar lembrete.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Adicionar Lembrete</h1>
        
        <div className="custom-select">
          <h4>Selecione um paciente</h4>
          <select id="paciente" value={pacienteSelecionado ?? ""} onChange={handleSelecionarPaciente}>
            <option value="">Selecionar pacientes</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome} {paciente.sobrenome}
              </option>
            ))}
          </select>
        </div>

        <div className="lembrete-form">
          <input
            type="text"
            name="titulo"
            placeholder="Título do Lembrete"
            value={lembrete.titulo}
            onChange={handleInputChange}
          />
          <textarea
            name="descricao"
            placeholder="Descrição do Lembrete"
            value={lembrete.descricao}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="data"
            value={lembrete.data}
            onChange={handleInputChange}
          />
        </div>

        {pacienteSelecionado && (
          <button onClick={handleAdicionarLembrete}>Adicionar Lembrete</button>
        )}
        {aviso && <p>{aviso}</p>}
      </div>
    </>
  );
};

export default AdicionarLembrete;

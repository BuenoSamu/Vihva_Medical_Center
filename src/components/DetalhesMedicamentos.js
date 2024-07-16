import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { doc, getDoc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import './DetalhesMedicamentos.css';
import Navbar from "./Navbar";
import { auth } from "./firebaseConfig"; // Importe o Firebase Auth se necessário

const DetalhesMedicamentos = () => {
  const { id } = useParams();
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [aviso, setAviso] = useState(null); // Estado para controlar o aviso

  useEffect(() => {
    const fetchMedicamento = async () => {
      try {
        const medicamentoDoc = doc(db, "remedios", id);
        const medicamentoSnap = await getDoc(medicamentoDoc);
        if (medicamentoSnap.exists()) {
          const medicamentoData = medicamentoSnap.data();
          setMedicamento({
            nome: medicamentoData.nome ?? null,
            Url: medicamentoData.Url ?? null,
            nomecomercial: medicamentoData.nomecomercial ?? null,
            administracao: medicamentoData.administracao ?? null,
            efeitoscolaterais: medicamentoData.efeitoscolaterais ?? null,
            tipo: medicamentoData.tipo ?? null,
            descricao: medicamentoData.descricao ?? null,
          });
        } else {
          console.error("Esse medicamento não existe");
          setMedicamento(null);
        }
      } catch (error) {
        console.error("Erro ao buscar medicamento:", error);
        setMedicamento(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamento();
  }, [id]);

  useEffect(() => {
    const fetchPacientesCompletos = async () => {
      try {
        // Obter o UID do médico autenticado
        const user = auth.currentUser;
        if (user) {
          const medicoUid = user.uid;
          // Buscar os dados do médico para obter o array de pacientes
          const medicoDoc = await getDoc(doc(db, 'medicos', medicoUid));
          if (medicoDoc.exists()) {
            const medicoData = medicoDoc.data();
            const pacientesIds = medicoData.pacientes ?? [];
            const pacientesPromises = pacientesIds.map(async (pacienteId) => {
              // Buscar o documento do paciente para obter nome e sobrenome
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
    setAviso(null); // Limpa o aviso ao selecionar um novo paciente
  };

  const handleAdicionarRemedio = async () => {
    if (!pacienteSelecionado) {
      return; // Se nenhum paciente estiver selecionado, retorna sem fazer nada
    }

    try {
      // Verificar se o paciente já possui o remédio no array de remedios
      const pacienteDoc = await doc(db, 'clientes', pacienteSelecionado);
      const pacienteSnap = await getDoc(pacienteDoc);
      if (pacienteSnap.exists()) {
        const pacienteData = pacienteSnap.data();
        const remediosArray = pacienteData.remedios ?? [];
        if (remediosArray.includes(id)) {
          setAviso("Este remédio já foi adicionado para este paciente.");
        } else {
          // Adicionar o remédio ao array de remedios do paciente
          await updateDoc(pacienteDoc, {
            remedios: arrayUnion(id)
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!medicamento) {
    return <div>Medicamento não encontrado</div>;
  }

  return (
    <div className="medicamento-detalhes-container">
      <Navbar />
      <h1>{medicamento.nome}</h1>
      {medicamento.Url && <img src={medicamento.Url} alt={medicamento.nome} />}
      {medicamento.nomecomercial && <p><strong>Nome Comercial:</strong> {medicamento.nomecomercial}</p>}
      {medicamento.administracao && <p><strong>Administração:</strong> {medicamento.administracao}</p>}
      {medicamento.efeitoscolaterais && <p><strong>Efeitos Colaterais:</strong> {medicamento.efeitoscolaterais}</p>}
      {medicamento.tipo && <p><strong>Tipo:</strong> {medicamento.tipo}</p>}
      {medicamento.descricao && <p><strong>Descrição:</strong> {medicamento.descricao}</p>}

      {/* Lista suspensa para selecionar pacientes */}
      <div>
        <label htmlFor="paciente">Selecione um paciente:</label>
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
          <button onClick={handleAdicionarRemedio}>Adicionar Remédio</button>
          {aviso && <p>{aviso}</p>}
        </div>
      )}
    </div>
  );
};

export default DetalhesMedicamentos;

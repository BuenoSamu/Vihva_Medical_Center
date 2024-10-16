import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import Navbar from "./Navbar";
import 'moment/locale/pt-br';
import moment from 'moment';
import CalendarioCustomizado from './Calendario'; // Importa corretamente o componente de calendário
import calendarioImg from './calendario.png'; // Importa a imagem do calendário
import { auth } from "./firebaseConfig";
import './Consultas.css'
import { motion } from 'framer-motion'; 

const AdicionarLembrete = () => {
  const [lembrete, setLembrete] = useState({ titulo: "", descricao: "", data: "" });
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState([]);
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
      <motion.div
        initial="hidden"
        animate="show"
        variants={loginOpacityAnimation}
        className='principal-container'
      >
      <div className="medicamentos-container">
        <table className="consultas-table">
          <thead>
            <tr>
              <th colSpan="3" scope="row">
                <div className='header-wrapper'>
                  <h1 className='TitleDash'>Área de Marcação de Consultas</h1>
                  <div className='secaoDireita'>
                    <span className="dataMed">
                      <img className="imgData" src={calendarioImg} alt="Calendário" />
                      <h3 className='textData'>{dataAtual}</h3>
                    </span>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th colSpan="2">
                <p className='descDashMed'>Marque consultas para seus pacientes!</p>
              </th>
            </tr>
          </thead>
            <tr style={{height: "10px"}}>
              <td style={{ width: "1%"}}>
                <div className="containerCon">
                  <h3 style={{fontSize: "25px"}}>Selecione uma data</h3>
                  <CalendarioCustomizado
                    selectedDate={lembrete.data ? new Date(lembrete.data) : null} 
                    onChange={(date) => handleInputChange({ target: { name: 'data', value: date.toISOString().split('T')[0] } })} 
                  />
                </div>
              </td>
              <td>
                <div className="containerCondesc">
                  <div className="organizadorcentro">
                  <h3 style={{fontSize: "25px", textAlign: "center"}}>Descreva a consulta</h3>
                  <div className="organizadorcentroCampos">
                    <input
                    className='inputTitulocon'
                      type="text"
                      name="titulo"
                      placeholder="Título do Lembrete"
                      value={lembrete.titulo}
                      onChange={handleInputChange}
                    />
                    <textarea
                    className='inputDesccon'
                      name="descricao"
                      placeholder="Descrição do Lembrete"
                      value={lembrete.descricao}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                  <div className="custome-select">
                  <h4 className="titleSelectMed" htmlFor="paciente" style={{color: "#6096a8", fontSize: "25px"}}>Selecione um paciente</h4>
                
                  <select id="paciente"  style={{border:"2px solid #6096a8"}} value={pacienteSelecionado ?? ""} onChange={handleSelecionarPaciente}>
                    <option value="">Selecionar pacientes</option>
                    {pacientes.map(paciente => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome} {paciente.sobrenome}
                      </option>
                    ))}
                  </select>
                  </div>
                  {pacienteSelecionado && (
                    <button className="buttonaddCon" onClick={handleAdicionarLembrete}>Adicionar Consulta</button>
                  )}
                  {aviso && <p style={{marginTop: "90px", marginLeft: "90dp", textAlign: "center"}}>{aviso}</p>}
                  </div>
                </div>
              </td>
            </tr>
        </table>
      </div>
      </motion.div>
    </>
  );
};

export default AdicionarLembrete;

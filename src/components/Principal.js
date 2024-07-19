import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PagePrincipal.css';
import Profile from './Perfil';
import Navbar from './Navbar';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const Principal = () => {
  const [uid, setUid] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [medicoId, setMedicoId] = useState(null);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

  const handleAdicionarPaciente = async () => {
    if (medicoId) {
      try {
        const pacienteSnapshot = await getDocs(query(collection(db, 'clientes'), where('uid', '==', uid)));

        if (!pacienteSnapshot.empty) {
          const pacienteDoc = pacienteSnapshot.docs[0];
          const pacienteId = pacienteDoc.id;

          const solicitacaoAmizade = {
            pacienteId: pacienteId,
            medicoId: medicoId,
            status: 'pendente',
          };

          await addDoc(collection(db, 'solicitacoesAmizade'), solicitacaoAmizade);
          alert('Solicitação de amizade enviada!');
        } else {
          alert('Nenhum paciente encontrado com o UID fornecido.');
        }
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        alert('Ocorreu um erro ao buscar o paciente.');
      }
    } else {
      alert('Médico não autenticado.');
    }
  };

  useEffect(() => {
    if (medicoId) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'solicitacoesAmizade'), where('medicoId', '==', medicoId)), 
        (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'modified') {
              const solicitacao = change.doc.data();
              if (solicitacao.status === 'aceita') {
                await atualizarPerfilMedico(medicoId, solicitacao.pacienteId);
              }
            }
          });

          const solicitacoesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSolicitacoes(solicitacoesData);
        }
      );

      return () => unsubscribe();
    }
  }, [medicoId]);

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
                return { id: pacienteDoc.docs[0].id, ...pacienteData };
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

  return (
    <div className='principal-container'>
      <Navbar />
      <div className='content'>
        <div className='containerAdicionarPac'>
        <h3>Adicionar Paciente</h3>
          <input
          className='inputLogin'
            type='text'
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder='Digite o código do paciente'
          />
          <button className='buttonLogin' onClick={handleAdicionarPaciente}>Adicionar Paciente</button>
          <h3>Solicitações de Amizade</h3>
          <ul>
            {solicitacoes.map((solicitacao) => (
              <li key={solicitacao.id}>
                {solicitacao.pacienteId} - {solicitacao.status}
              </li>
            ))}
          </ul>
        </div>
        <div className='containerPac'>
          <h3 className='textPacAdd'>Pacientes Adicionados</h3>
          {pacientes.map(paciente => (
            <div key={paciente.id} className='paciente-card'>
              <Link to={`/PerfilPaciente/${paciente.id}`}>
              <div className='pacienteInfo'>
                {paciente.imageUrl && <img src={paciente.imageUrl} alt={`${paciente.nome} ${paciente.sobrenome}`} className='paciente-imagem' />}
              <div>
                <p className='pacienteNome'>{paciente.nome} {paciente.sobrenome}</p>
                <p className='pacienteCodigo'><strong>Código do paciente:</strong> {paciente.uid}</p>
              </div>
              </div>  
              </Link>
            </div>
          ))}
          <div>
          </div>
        </div>
      </div>
      <div className='containerPerfil'>
        <Profile />
        </div>
    </div>
  );
};

export default Principal;

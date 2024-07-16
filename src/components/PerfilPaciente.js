import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from './firebaseConfig';
import Navbar from './Navbar';
import './PerfilPaciente.css';

const PerfilPaciente = () => {
  const { pacienteId } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [remedios, setRemedios] = useState([]);
  const [doenca, setDoenca] = useState([]);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const pacienteDoc = await getDoc(doc(db, 'clientes', pacienteId));
        if (pacienteDoc.exists()) {
          const pacienteData = pacienteDoc.data();
          setPaciente(pacienteData);

          if (pacienteData.remedios && pacienteData.remedios.length > 0) {
            const remediosData = await fetchRelatedData('remedios', pacienteData.remedios);
            setRemedios(remediosData);
          }

          if (pacienteData.doenca && pacienteData.doenca.length > 0) {
            const doencaData = await fetchRelatedData('doenca', pacienteData.doenca);
            setDoenca(doencaData);
          }
        } else {
          console.error('Paciente não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
      }
    };

    fetchPaciente();
  }, [pacienteId]);

  const fetchRelatedData = async (collectionName, idsArray) => {
    try {
      const q = query(collection(db, collectionName), where('__name__', 'in', idsArray));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
      return [];
    }
  };

  if (!paciente) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='perfil-paciente'>
      <Navbar />
      <h1 className="profile-title">Perfil do Paciente</h1>
      {paciente.imageUrl && <img src={paciente.imageUrl} alt={`${paciente.nome} ${paciente.sobrenome}`} className='perfil-imagem' />}
      <div className="profile-details">
        <p><strong>Nome:</strong> {paciente.nome}</p>
        <p><strong>Sobrenome:</strong> {paciente.sobrenome}</p>
        <p><strong>Altura:</strong> {paciente.altura} cm</p>
        <p><strong>Peso:</strong> {paciente.peso} kg</p>
        <p><strong>Gênero:</strong> {paciente.genero}</p>
        <p><strong>Biografia:</strong> {paciente.biografia}</p>
        <p><strong>Idade:</strong> {paciente.idade}</p>
      </div>

      <h3>Faz uso de:</h3>
      <ul>
        {remedios.map((remedio, index) => (
          <li key={index}>
            <p><strong>Nome do medicamento:</strong> {remedio.nome}</p>
            <p><strong>Foto do medicamento:</strong></p>
            {remedio.Url && <img src={remedio.Url} alt={remedio.Url} />}
          </li>
        ))}
      </ul>

      <h3>Portador de:</h3>
      <ul>
        {doenca.map((doenca, index) => (
          <li key={index}>
            <p><strong>Nome da doença:</strong> {doenca.nome}</p>
            {doenca.Url && <img src={doenca.Url} alt={doenca.nome} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PerfilPaciente;

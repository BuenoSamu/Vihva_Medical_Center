// src/components/Criaperfil.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Criaperfil.css';

const Criaperfil = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [crm, setCrm] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [centroMedico, setCentroMedico] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const uid = user.uid;

      if (!nome || !sobrenome || !crm || !especializacao || !centroMedico) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      let imageUrl = '';

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `medicos/${uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(doc(db, 'medicos', uid), {
        nome,
        sobrenome,
        crm,
        especializacao,
        centroMedico,
        imageUrl,
      });

      navigate('/Principal');
    } catch (error) {
      setError('Erro ao salvar perfil. Tente novamente.');
      console.error('Erro ao salvar perfil:', error);
    }
  };

  return (
    <div className="Criaperfil-container">
      <h2>Doutor crie seu perfil</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
        />
        <input
          type="text"
          placeholder="CRM"
          value={crm}
          onChange={(e) => setCrm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Especialização"
          value={especializacao}
          onChange={(e) => setEspecializacao(e.target.value)}
        />
        <input
          type="text"
          placeholder="Centro Médico"
          value={centroMedico}
          onChange={(e) => setCentroMedico(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        {error && <p>{error}</p>}
        <button type="submit">Salvar Perfil</button>
      </form>
    </div>
  );
};

export default Criaperfil;

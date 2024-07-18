// src/components/Criaperfil.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { motion } from 'framer-motion';
import { updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Certifique-se de que sua versão do Firebase suporte essas importações
import './Criaperfil.css';

const Criaperfil = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [crm, setCrm] = useState('');
  const [especializacao, setEspecializacao] = useState('');
  const [centroMedico, setCentroMedico] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const loginOpacityAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 1.3,
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
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
    <div>
      <motion.div className='ContainerCria'>
        <motion.h1 className='titleCriaperfil' initial="hidden" animate="show" variants={loginOpacityAnimation}>Criação de Perfil</motion.h1>
        <motion.p className='slogan' initial="hidden" animate="show" variants={loginOpacityAnimation}>Insira suas informações para mostrarmos ao seus pacientes!</motion.p>
      </motion.div>
      <div>
        <div className="Ccriaperfil">
          <h2 className='descTitle'>Insira seus dados</h2>
          <form onSubmit={handleSubmit}>
            <div className="imageUploadContainer">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file" className="fileLabel">
                {preview ? (
                  <img src={preview} alt="Preview" className="profile-photoCria" />
                ) : (
                  "Escolher Foto"
                )}
              </label>
            </div>
            <div className='inputContainer'>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className='inputNomeCria'
              />
              <input
                type="text"
                placeholder="Sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                className='inputNomeCria'
              />
            </div>
            <div className='inputContainer'>
              <input
                type="text"
                placeholder="CRM"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                className='inputDadosCria'
              />
            </div>
            <div className='inputContainer'>
              <input
                type="text"
                placeholder="Especialização"
                value={especializacao}
                onChange={(e) => setEspecializacao(e.target.value)}
                className='inputDadosCria'
              />
            </div>
            <div className='inputContainer'>
              <input
                type="text"
                placeholder="Centro Médico"
                value={centroMedico}
                onChange={(e) => setCentroMedico(e.target.value)}
                className='inputDadosCria'
              />
            </div>
            {error && <p>{error}</p>}
            <button type="submit" className='buttonLogin'>Salvar Perfil</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Criaperfil;

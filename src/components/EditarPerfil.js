import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import { motion } from 'framer-motion';
import Navbar from './Navbar'; // Certifique-se de que o Navbar esteja importado corretamente

const loginOpacityAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } }
};

const EditarPerfil = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('Usuário não autenticado.');
        }

        const uid = user.uid;
        console.log(`Fetching data for UID: ${uid}`);

        const userDoc = await getDoc(doc(db, 'medicos', uid));

        if (userDoc.exists()) {
          console.log('Documento encontrado:', userDoc.data());
          setProfileData(userDoc.data());
        } else {
          throw new Error('Perfil não encontrado.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar perfil. Verifique sua conexão e tente novamente.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const uid = user.uid;
      console.log('Atualizando documento:', profileData);

      await updateDoc(doc(db, 'medicos', uid), profileData);
      console.log('Perfil salvo com sucesso');

      navigate('/Perfil');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setError('Erro ao salvar perfil. Verifique os dados e tente novamente.');
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="editar-perfil-container">
      <motion.div className='ContainerCria'>
        <motion.h1
          className='titleCriaperfil'
          initial="hidden"
          animate="show"
          variants={loginOpacityAnimation}
        >
          Edição de Perfil
        </motion.h1>
        <motion.p
          className='slogan'
          initial="hidden"
          animate="show"
          variants={loginOpacityAnimation}
        >
          Atualize suas informações para mostrarmos aos seus pacientes!
        </motion.p>
      </motion.div>
      <div className="Ccriaperfil">
        <h2 className='descTitle'>Atualize seus dados</h2>
        {profileData && (
          <form onSubmit={handleSave} style={{width: '80%'}}>
            <div className='inputContainer'>
              <input
              placeholder='Nome'
                type="text"
                name="nome"
                value={profileData.nome || ''}
                onChange={handleChange}
                className='inputDadosCriaPerfil'
              />
            </div>
            <div className='inputContainer'>
              <input
              placeholder='Sobrenome'
                type="text"
                name="sobrenome"
                value={profileData.sobrenome || ''}
                onChange={handleChange}
                className='inputDadosCriaPerfil'
              />
            </div>
            <div className='inputContainer'>
              <input
              placeholder='CRM'
                type="text"
                name="crm"
                value={profileData.crm || ''}
                onChange={handleChange}
                className='inputDadosCriaPerfil'
              />
            </div>
            <div className='inputContainer'>
              <input
              placeholder='Especialização'
                type="text"
                name="especializacao"
                value={profileData.especializacao || ''}
                onChange={handleChange}
                className='inputDadosCriaPerfil'
              />
            </div>
            <div className='inputContainer'>
              <input
              placeholder='Centro Médico'
                type="text"
                name="centroMedico"
                value={profileData.centroMedico || ''}
                onChange={handleChange}
                className='inputDadosCriaPerfil'
              />
            </div>
            <button type="submit" className="buttonLogin">Salvar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditarPerfil;

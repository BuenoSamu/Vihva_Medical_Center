import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css'; 
import Navbar from './Navbar';

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
        console.log(`Fetching data for UID: ${uid}`); // Log para verificação

        const userDoc = await getDoc(doc(db, 'medicos', uid));

        if (userDoc.exists()) {
          console.log('Documento encontrado:', userDoc.data()); // Log para verificação
          setProfileData(userDoc.data());
        } else {
          throw new Error('Perfil não encontrado.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error); // Log detalhado
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
      console.log('Atualizando documento:', profileData); // Log para verificação

      await updateDoc(doc(db, 'medicos', uid), profileData);
      console.log('Perfil salvo com sucesso'); // Log para confirmação

      navigate('/Perfil'); 
    } catch (error) {
      console.error('Erro ao salvar perfil:', error); // Log detalhado
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
      <Navbar />
      <h2>Editar Perfil</h2>
      {profileData && (
        <form className="editar-perfil-form" onSubmit={handleSave}>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={profileData.nome || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Sobrenome:
            <input
              type="text"
              name="sobrenome"
              value={profileData.sobrenome || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            CRM:
            <input
              type="text"
              name="crm"
              value={profileData.crm || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Especialização:
            <input
              type="text"
              name="especializacao"
              value={profileData.especializacao || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Centro Médico:
            <input
              type="text"
              name="centroMedico"
              value={profileData.centroMedico || ''}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="editar-perfil-button">Salvar</button>
        </form>
      )}
    </div>
  );
};

export default EditarPerfil;

// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Perfil.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
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
        const userDoc = await getDoc(doc(db, 'medicos', uid));

        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          throw new Error('Perfil não encontrado.');
        }

        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar perfil.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    navigate('/EditarPerfil'); // Rota para a pagina de edição
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      {profileData?.imageUrl && (
        <div>
          <img src={profileData.imageUrl} alt="Foto do Médico" className="profile-photo" />
        </div>
      )}
      <h2>Perfil do Médico</h2>
      {profileData && (
        <div className="profile-details">
          <p><strong>Nome:</strong> {profileData.nome}</p>
          <p><strong>Sobrenome:</strong> {profileData.sobrenome}</p>
          <p><strong>CRM:</strong> {profileData.crm}</p>
          <p><strong>Especialização:</strong> {profileData.especializacao}</p>
          <p><strong>Centro Médico:</strong> {profileData.centroMedico}</p>
          <button onClick={handleEditProfile} className="edit-profile-button">Editar Perfil</button>
        </div>
      )}
    </div>
  );
};

export default Profile;

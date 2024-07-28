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
    navigate('/EditarPerfil'); 
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Navbar />
      <div>
        <div className='profile-container'>
      {profileData?.imageUrl && (
        <div>
          <img src={profileData.imageUrl} alt="Foto do Médico" className="imgPerfil" />
        </div>
      )}
      <div className='profileNomecontainer'>
       <h2>{profileData.nome} {profileData.sobrenome}</h2>
       <div className='profileInfocontainer'>
          <h3 className='h3Perfil'>CRM: {profileData.crm}</h3>
          <h3 className='h3Perfil'>Especialização: {profileData.especializacao}</h3>
          <button onClick={handleEditProfile} className="edit-profile-button">Editar Perfil</button>
          </div>
          </div>
          
      </div>
      </div>
      {profileData && (
        <div className="profile-details-container">
        <div className="profile-details">
          <h3>Informações</h3>
          {profileData.nomeClinica && <p><strong>Nome da Clínica:</strong> {profileData.nomeClinica}</p>}
          {profileData.localiza && <p><strong>Localização:</strong> {profileData.localiza}</p>}
          {profileData.detalhesClinica && <p><strong>Detalhes da Clínica:</strong> {profileData.detalhesClinica}</p>}
        </div>
        <div className="profile-images">
          <h3>Imagens da clínica</h3>
          {profileData.fotoUm && <img src={profileData.fotoUm} alt="Foto 1 da Clínica" className='imgClinica' />}
          {profileData.fotoDois && <img src={profileData.fotoDois} alt="Foto 2 da Clínica" className='imgClinica' />}
          {profileData.fotoTres && <img src={profileData.fotoTres} alt="Foto 3 da Clínica" className='imgClinica' />}
        </div>
    </div>
      )}
    </div>
  );
};

export default Profile;

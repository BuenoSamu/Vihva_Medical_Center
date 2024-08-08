import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Navbar from './Navbar';
import Carroussel from './carroussel'; // Importar o componente do carrossel
import './Perfil.css';
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
    <div className='alinhamento'>
      <Navbar />
      <div className='profile-container'>
        <div className='profiletudocontainer'>
          {profileData?.imageUrl && (
            <div className='profileImgcontainer'>
              <img 
                src={profileData.imageUrl} 
                alt="Foto do Médico" 
                className="imgPerfil" 
              />
            </div>
          )}     
          <div className='profileNomecontainer'>
            <div className='alinhamento2'>
              <h2>{profileData.nome} {profileData.sobrenome}</h2>          
              <button 
                onClick={handleEditProfile} 
                className='editprofileButton'
              >
                Editar Perfil
              </button>
            </div>
            <div className='profileInfocontainer'>
              <h3 className='h3Perfil'>CRM: {profileData.crm}</h3>
              <h3 className='h3Perfil' style={{width: "250px"}}>Especialização: {profileData.especializacao}</h3>
            </div>
          </div>
        </div>
        <div className='flex-container'>
          <div className='infoClinica'>
            <h3 className='tituloDesc'>Informações</h3>
            <table>
              <div className='flex-containerInformacoes'>
              <tbody>
                {profileData.nomeClinica && (
                  <tr>
                    <td><span style={{color: '#6096a8', fontSize: 'larger'}}>Nome da Clínica:</span></td>
                    <td>{profileData.nomeClinica}</td>
                  </tr>
                )}
                {profileData.localiza && (
                  <tr>
                    <td><h3 className='tituloInformacoes'>Detalhes da Clínica</h3></td>
                    <td></td>
                  </tr>
                                    <tr>
                                    <td>
                                      <div>
                                        
                                        <p className='detalhesTexto'>{profileData.localiza}</p>
                                      </div>
                                    </td>
                                  </tr>
                )}
                {profileData.detalhesClinica && (
                  <tr>
                    <td>
                      <div>
                        <h3 className='tituloInformacoes'>Detalhes da Clínica</h3>
                        <p className='detalhesTexto'>{profileData.detalhesClinica}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              </div>
            </table>
          </div>
          <hr className='hrPerfil'/>
          <div>
          <h3 className='tituloDescimagens'>Imagens da clínica</h3>
          <div className='image-gallery-container'>
        
            {profileData.fotoUm || profileData.fotoDois || profileData.fotoTres ? (
              <Carroussel images={[profileData.fotoUm, profileData.fotoDois, profileData.fotoTres]} />
            ) : (
              <p>Nenhuma imagem disponível</p>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

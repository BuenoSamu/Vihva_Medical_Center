import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import './Navbar.css';
import logo from './vivah_logo_500x.png'; 
import casa from './home.png';
import config from './opcoes.png'; 
import remedio from './remedio.png';
import perfil from './perfil.png';
import calendario from './calendario.png';

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
      {profileData?.imageUrl && (
        <div>
          <img src={profileData.imageUrl} alt="Foto do Médico" className="profile-photo" />
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Profile />
      <ul>
        <NavItem to="/Principal" icon={casa} text="Início" currentPath={location.pathname} />
        <NavItem to="/consultas" icon={calendario} text="Consultas" currentPath={location.pathname} />
        <NavItem to="/Medicamentos" icon={remedio} text="Medicamentos" currentPath={location.pathname} />
        <NavItem to="/Perfil" icon={perfil} text="Perfil" currentPath={location.pathname} />
        <NavItem to="/settings" icon={config} text="Configurações" currentPath={location.pathname} />
      </ul>
      <h2>
        Produzido por<br />
        <span style={{ fontFamily: 'Peanut', fontWeight: 'normal', fontSize: '25px' }}>Vihva Company</span>
      </h2>
    </nav>
  );
};

const NavItem = ({ to, icon, text, currentPath }) => {
  const isActive = currentPath === to;

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to}>
        {icon && <img src={icon} className='iconNavbar' alt='Ícone' />}
        {text}
      </Link>
    </li>
  );
};

export default Navbar;

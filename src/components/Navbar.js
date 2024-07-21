import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from './vivah_logo_500x.png'; 
import casa from './home.png';
import config from './opcoes.png' 
import remedio from './remedio.png'
import perfil from './perfil.png'
import calendario from './calendario.png'
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <img src={logo} className='imgNavbar' alt='Logo'/>
      <ul>
        <NavItem to="/Principal" icon={casa} text="Início" currentPath={location.pathname} />
        <NavItem to="/Lembretes" icon={perfil} text="Lembretes" currentPath={location.pathname} />
        <NavItem to="/consultas" icon={calendario} text="Consultas" currentPath={location.pathname} />
        <NavItem to="/Medicamentos" icon={remedio} text="Medicamentos" currentPath={location.pathname} />
        <NavItem to="/settings" icon={config} text="Configurações" currentPath={location.pathname} />
      </ul>
      <h2>Produzido por<br/> <span style={{ fontFamily: 'Peanut', fontWeight: 'normal', fontSize: '25px' }}>Vihva Company</span></h2>
    </nav>
  );
};

const NavItem = ({ to, icon, text, currentPath }) => {
  const isActive = currentPath === to; 

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to}>
        {icon && <img src={icon} className='iconNavbar' alt='Ícone'/>}
        {text}
      </Link>
    </li>
  );
};

export default Navbar;

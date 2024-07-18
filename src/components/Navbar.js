import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from './vivah_logo_500x.png'; 
import casa from './home.png';

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <img src={logo} className='imgNavbar' alt='Logo'/>
      <ul>
        <NavItem to="/Principal" text="Início" currentPath={location.pathname} />
        <NavItem to="/perfil" text="Perfil" currentPath={location.pathname} />
        <NavItem to="/Lembretes" text="Lembretes" currentPath={location.pathname} />
        <NavItem to="/consultas" text="Consultas" currentPath={location.pathname} />
        <NavItem to="/Medicamentos" text="Medicamentos" currentPath={location.pathname} />
        <NavItem to="/settings" text="Configurações" currentPath={location.pathname} />
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

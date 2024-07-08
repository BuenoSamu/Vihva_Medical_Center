// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Vihva Medical Center</h2>
      <ul>
        <li><Link to ="/Principal">Inicio</Link></li>
        <li><Link to="/perfil">Perfil</Link></li>
        <li><Link to= "/Lembretes">Lembretes</Link></li>
        <li><Link to="/consultas">Consultas</Link></li>
        <li><Link to="/Medicamentos">Medicamentos</Link></li>
        <li><Link to="/settings">Configurações</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

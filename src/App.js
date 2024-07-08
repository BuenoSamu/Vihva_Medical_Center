// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Criaperfil from './components/Criaperfil';
import Principal from './components/PagePrincipal'; 
import Lembretes from './components/Lembretes'
import Perfil from './components/Perfil';
import EditarPerfil from './components/EditarPerfil';
import Medicamentos from './components/Medicamentos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Criaperfil" element={<Criaperfil />} />
        <Route path="/Principal" element={<Principal />} /> 
        <Route path="/Lembretes" element={<Lembretes/>} />
        <Route path="/Perfil" element= {<Perfil/>} />
        <Route path="/EditarPerfil" element = {<EditarPerfil/>} />
        <Route path ="/Medicamentos" element = {<Medicamentos/>} />
      </Routes>
    </Router>
  );
}

export default App;

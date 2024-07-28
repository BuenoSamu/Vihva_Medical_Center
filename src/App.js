import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Criaperfil from './components/Criaperfil';
import CriaClinica from './components/CriaClinica';
import Principal from './components/Principal'; 
import Lembretes from './components/Lembretes';
import Perfil from './components/Perfil';
import EditarPerfil from './components/EditarPerfil';
import Medicamentos from './components/Medicamentos';
import PerfilPaciente from './components/PerfilPaciente';
import DetalhesMedicamentos from './components/DetalhesMedicamentos';


function App() {
  return (
    <Router>
      <AnimatePresence>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Criaperfil" element={<Criaperfil />} />
          <Route path="/CriaClinica" element={<CriaClinica />} />
          <Route path="/Principal" element={<Principal />} /> 
          <Route path="/Lembretes" element={<Lembretes />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/EditarPerfil" element={<EditarPerfil />} />
          <Route path="/Medicamentos" element={<Medicamentos />} />
          <Route path="/PerfilPaciente/:pacienteId" element={<PerfilPaciente />} /> 
          <Route path="/medicamento/:id" element={<DetalhesMedicamentos />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;

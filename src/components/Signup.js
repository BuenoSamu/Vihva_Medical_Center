// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Importa ícones do Feather Icons
import './Signup.css'; // Importa o arquivo de estilo CSS

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addUserToFirestore(user.uid, email);

      navigate('/Criaperfil');
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  const addUserToFirestore = async (uid, email) => {
    try {
      await setDoc(doc(db, 'medicos', uid), {
        email: email,
      });
    } catch (error) {
      console.error('Erro ao adicionar usuário ao Firestore', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <h1 className="title">Vihva</h1> {/* Título no topo da página */}
      <h2>Criação de Conta</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirme a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Criar Conta</button>
      </form>
      <p>Já tem uma conta? <Link to="/">Clique aqui para fazer Login</Link></p>
    </div>
  );
};

export default Signup;

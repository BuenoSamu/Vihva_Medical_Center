// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link, BrowserRouter } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaEnvelope } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';
import logo from './vivah_logo_500x.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      // Verifica se o perfil do usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, 'medicos', user.uid));
      if (userDoc.exists()) {
        navigate('/Principal');
      } else {
        navigate('/Criaperfil');
      }
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className='ContainerBemVindo'>
      <img src={logo} className='imgLogo'></img>
      <h1 className='titleBemvindo'>Vihva Medical Center</h1>
      <p className='slogan'>Elevando o nível do atendimento de clientes dia após dia</p>
      <p className='slogan'>Caso não tenha conta, crie agora!</p>
      <button className='naotenhoconta'><Link to="/signup">Criar Conta</Link></button>
      </div>
      <h1 className="titlea">Login</h1>
      
      <div className="Clogin">
        <p className='descTitle'>Insira seus dados</p>
        <form onSubmit={handleLogin}>
          <div className='inputContainer'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputLogin"
          />
          <FaEnvelope className="icon" />
          </div>
          <div className="inputContainer">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputLogin"
            />
            <div className='iconPassword'>
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            </div>
          </div>
          {error && <p>{error}</p>}
          <button type="submit" className="buttonLogin">Entrar</button>
        </form>
        <p className='textEsqueciSenha'><u>Esqueci minha senha</u></p>
      </div>
    </div>
  );
};

export default Login;

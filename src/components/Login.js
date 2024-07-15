import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaEnvelope } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './Login.css';
import logo from './vivah_logo_500x.png';
import transition from "../transition";
import Signup from './Signup';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const containerAnimation = {
    hidden: {
      x: -1000,
    },
    show: {
      x: 0,
      transition: {
        delay: 1,
        ease: [0.250, 0.100, 0.250, 1.000],
        duration: 1,
      },
    },
  };

  const loginOpacityAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 1.3,
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('is-animating');

    return () => {
      html.classList.remove('is-animating');
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

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

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div>
      <motion.div className='ContainerBemVindo' initial="hidden" animate="show" variants={containerAnimation}>
        <motion.img src={logo} className='imgLogo' alt='Logo' variants={loginOpacityAnimation} />
        <motion.h1 className='titleBemvindo' variants={loginOpacityAnimation}>Vihva Medical Center</motion.h1>
        <motion.p className='slogan' variants={loginOpacityAnimation}>Elevando o nível do atendimento de clientes dia após dia</motion.p>
        <motion.p className='slogan' variants={loginOpacityAnimation}>Caso não tenha conta, crie agora!</motion.p>
        <motion.button className='naotenhoconta' variants={loginOpacityAnimation} onClick={handleSignupRedirect}>Criar Conta</motion.button>
      </motion.div>
      <motion.h1 className="titlea" variants={loginOpacityAnimation}>Login</motion.h1>
      <motion.div className="Clogin" initial="hidden" animate="show" variants={loginOpacityAnimation}>
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
      </motion.div>
    </div>
  );
};

export default transition(Login);

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { FaEnvelope } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 
import './Signup.css';
import { motion } from 'framer-motion';
import logo from './vivah_logo_500x.png'; 
import transitionCada from '../transitionCada';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const containerAnimation = {
    hidden: {
      x: 1000,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
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
    <div>
      <motion.div className='ContainerCadastro' initial="hidden" animate="show" variants={containerAnimation}>
        <motion.img src={logo} className='imgLogo' alt='Logo' initial="hidden" animate="show" variants={loginOpacityAnimation}/>
        <motion.h1 className='titleBemvindo' initial="hidden" animate="show" variants={loginOpacityAnimation}>Vihva Medical Center</motion.h1>
        <motion.p className='slogan' initial="hidden" animate="show" variants={loginOpacityAnimation}>Elevando o nível do atendimento de clientes dia após dia</motion.p>
        <motion.p className='slogan' initial="hidden" animate="show" variants={loginOpacityAnimation}>Caso já tenha conta, entre agora!</motion.p>
        <Link to="/"><motion.button className='naotenhoconta' initial="hidden" animate="show" variants={loginOpacityAnimation}>Fazer login</motion.button></Link>
      </motion.div>
      <div>
        <h1 className="titleCadas">Cadastro</h1>
        <motion.div className="Ccadastro" variants={loginOpacityAnimation}>
          <h2 className='descTitle'>Criação de Conta</h2>
          <form onSubmit={handleSignup}>
            <div className='inputContainer'>
              <input
                className='inputLogin'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="inputContainer">
              <input
                className='inputLogin'
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className='iconPassword'>
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
            <div className="inputContainer">
              <input
                className='inputLogin'
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirme a Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className='iconPassword'>
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>
            {error && <p>{error}</p>}
            <button type="submit" className='buttonCadastro'>Criar Conta</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default transitionCada(Signup);

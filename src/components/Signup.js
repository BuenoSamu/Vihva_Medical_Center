import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { FaEnvelope } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 
import './Signup.css';
import logo from './vivah_logo_500x.png'; 
import { AnimatePresence } from 'framer-motion';
import transitionCada from '../transition';

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
    <div>
      <div className='ContainerCadastro'>
        <img src={logo} className='imgLogo' alt='Logo' />
        <h1 className='titleBemvindo'>Vihva Medical Center</h1>
        <p className='slogan'>Elevando o nível do atendimento de clientes dia após dia</p>
        <p className='slogan'>Caso já tenha conta, entre agora!</p>
          <Link to="/"><button className='naotenhoconta'>Fazer login</button></Link>
      </div>
      <div>
        <h1 className="titleCadas">Cadastro</h1>
        <div className="Ccadastro">
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
        </div>
      </div>
    </div>
  );
};

export default transitionCada(Signup);

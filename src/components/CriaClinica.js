// src // components// CriaClinica.JS
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { motion } from 'framer-motion';
import { updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import './CriaClinica.css';

const CriaClinica = () => {
    const navigate = useNavigate();
    const [nomeClinica, setNomeClinica] = useState('');
    const [localiza, setLocaliza] = useState('');
    const [detalhesClinica, setDetalhesClinica] = useState('');
    const [fotoUm, setFotoUm] = useState(null);
    const [fotoDois, setFotoDois] = useState(null);
    const [fotoTres, setFotoTres] = useState(null);
    const [previewUm, setPreviewUm] = useState('');
    const [previewDois, setPreviewDois] = useState('');
    const [previewTres, setPreviewTres] = useState('');
    const [error, setError] = useState('');

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

    const handleFileChange = (e, setFile, setPreview) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const user = auth.currentUser;
         
            if (!user) {
                throw new Error('Usuario não autenticado.');
            }

            const uid = user.uid;

            if (!nomeClinica || !localiza || !detalhesClinica) {
                throw new Error('Por favor, preencha todos os campos');
            }

            const storage = getStorage();
            const uploadImage = async (file, filePath) => {
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, file);
                return await getDownloadURL(storageRef);
            };

            const fotoUmUrl = fotoUm ? await uploadImage(fotoUm, `medicos/${uid}/${fotoUm.name}`) : '';
            const fotoDoisUrl = fotoDois ? await uploadImage(fotoDois, `medicos/${uid}/${fotoDois.name}`) : '';
            const fotoTresUrl = fotoTres ? await uploadImage(fotoTres, `medicos/${uid}/${fotoTres.name}`) : '';

            await updateDoc(doc(db, 'medicos', uid), {
                nomeClinica,
                detalhesClinica,
                localiza,
                fotoUm: fotoUmUrl,
                fotoDois: fotoDoisUrl,
                fotoTres: fotoTresUrl,
            });

            navigate('/Principal');
        } catch (error) {
            setError('Erro ao salvar perfil. Tente novamente.');
            console.error('Erro ao salvar perfil:', error);
        }
    };

    return (
        <div>
            <motion.div className='ContainerClinica'>
                <motion.h1 className='titleCriaClinica' initial="hidden" animate="show" variants={loginOpacityAnimation}>
                    Criação do perfil da clinia
                </motion.h1>
                <motion.p className='slogan' initial="hidden" animate="show" variants={loginOpacityAnimation}>
                    Insira as informações da clinica ou hospital para mostrarmos ao seus pacientes!
                </motion.p>
            </motion.div>
            <div>
                <div className='Ccriaclinica'>
                    <h2 className='descTitle'>Insira os dados da clinica ou centro médico</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='imageUploaderContainerUM'>
                            <input
                                type="file"
                                id="fileUm"
                                onChange={(e) => handleFileChange(e, setFotoUm, setPreviewUm)}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="fileUm" className="fileLabel">
                                {previewUm ? (
                                    <img src={previewUm} alt="Preview" className="profile-photoCria" />
                                ) : (
                                    "Escolher Foto"
                                )}
                            </label>
                        </div>

                        <div className='imageUploaderContainerDois'>
                            <input
                                type="file"
                                id="fileDois"
                                onChange={(e) => handleFileChange(e, setFotoDois, setPreviewDois)}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="fileDois" className="fileLabel">
                                {previewDois ? (
                                    <img src={previewDois} alt="Preview" className="profile-photoCria" />
                                ) : (
                                    "Escolher Foto"
                                )}
                            </label>
                        </div>

                        <div className='imageUploaderContainerTres'>
                            <input
                                type="file"
                                id="fileTres"
                                onChange={(e) => handleFileChange(e, setFotoTres, setPreviewTres)}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="fileTres" className="fileLabel">
                                {previewTres ? (
                                    <img src={previewTres} alt="Preview" className="profile-photoCria" />
                                ) : (
                                    "Escolher Foto"
                                )}
                            </label>
                        </div>

                        <div className='inputContainer'>
                            <input
                                type="text"
                                placeholder="Nome da Clínica"
                                value={nomeClinica}
                                onChange={(e) => setNomeClinica(e.target.value)}
                                className='inputNomeCria'
                            />
                            <input
                                type="text"
                                placeholder="Localização"
                                value={localiza}
                                onChange={(e) => setLocaliza(e.target.value)}
                                className='inputNomeCria'
                            />
                            <input
                                type="text"
                                placeholder="Detalhes da Clínica"
                                value={detalhesClinica}
                                onChange={(e) => setDetalhesClinica(e.target.value)}
                                className='inputNomeCria'
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className='submitButton'>Salvar Perfil</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CriaClinica;

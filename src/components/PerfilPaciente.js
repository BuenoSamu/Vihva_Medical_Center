import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from './firebaseConfig';
import Navbar from './Navbar';
import './PerfilPaciente.css';

const PerfilPaciente = () => {
  const { pacienteId } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [remedios, setRemedios] = useState([]);
  const [doenca, setDoenca] = useState([]);
  const [hoveredRemedio, setHoveredRemedio] = useState(null);
  const [hoveredDoenca, setHoveredDoenca] = useState(null);  
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const pacienteDoc = await getDoc(doc(db, 'clientes', pacienteId));
        if (pacienteDoc.exists()) {
          const pacienteData = pacienteDoc.data();
          setPaciente(pacienteData);

          // Buscar dados de medicamentos
          if (pacienteData.remedios && pacienteData.remedios.length > 0) {
            const remediosData = await fetchRelatedData('remedios', pacienteData.remedios);
            setRemedios(remediosData);
          }

          // Buscar dados de doenças
          if (pacienteData.doenca && pacienteData.doenca.length > 0) {
            const doencaData = await fetchRelatedData('doenca', pacienteData.doenca);
            setDoenca(doencaData);
          }
        } else {
          console.error('Paciente não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
      }
    };

    fetchPaciente();
  }, [pacienteId]);

  const fetchRelatedData = async (collectionName, idsArray) => {
    try {
      const q = query(collection(db, collectionName), where('__name__', 'in', idsArray));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
      return [];
    }
  };

  const handleMouseEnter = (event, item, type) => {
    const { clientX, clientY } = event;  
    const popupHeight = 150; // Ajuste a altura do popup conforme necessário
    setPopupPosition({ top: clientY - popupHeight, left: clientX + 15 });
    if (type === 'remedio') {
      setHoveredRemedio(item); 
    } else if (type === 'doenca') {
      setHoveredDoenca(item); 
    }
  };

  const handleMouseLeave = () => {
    setHoveredRemedio(null);
    setHoveredDoenca(null);
  };

  if (!paciente) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='alinhamento'>
      <Navbar />
      <div className='profile-containerPac'>
        <div className='profiletudocontainer'>
          {paciente.imageUrl && (
            <div className='profileImgcontainer'>
              <img 
                src={paciente.imageUrl} 
                alt={`${paciente.nome} ${paciente.sobrenome}`} 
                className='imgPerfil' 
              />
            </div>
          )}
          <div className='profileNomecontainer'>
            <div className='alinhamento2'>
              <h2>{paciente.nome} {paciente.sobrenome}</h2>
            </div>
            <div className='profileInfocontainer'>
              <h3 className='h3PerfilPac'><span style={{color: "#247894"}}>Altura</span><br/> {paciente.altura} cm</h3>
              <h3 className='h3PerfilPac'><span style={{color: "#247894"}}>Peso </span><br/>  {paciente.peso} kg</h3>
              <h3 className='h3PerfilPac'><span style={{color: "#247894"}}>Gênero</span><br/>  {paciente.genero}</h3>             
              <h3 className='h3PerfilPac'><span style={{color: "#247894"}}>Idade</span><br/>  {paciente.idade}</h3>
            </div>
          </div>
        </div>
        <div className='table-container'>
          <div className='infoClinicaPac'>
            <div className='ContainerMedPac'>
              <h3 className='tituloDescPac'>Enfermidades</h3>
              <ul className='uldoencasPac'>
  {paciente['prescriçõesDoença'] && paciente['prescriçõesDoença'].map((doencaItem, index) => (
    <li 
      key={index} 
      className='cardDoencaPac'
      onMouseEnter={(e) => handleMouseEnter(e, doencaItem, 'doenca')} 
      onMouseLeave={handleMouseLeave}                            
    >
      {doencaItem.urlImagem && <img src={doencaItem.urlImagem} alt={doencaItem.nome} className='imgprofileDoencas' />}
      <p className='textDoencasprofile'>{doencaItem.nome}</p>
    </li>
  ))}
</ul>
            </div>
            <div className='ContainerRemPac'>
              <h3 className='tituloDescPac' style={{color: "#60AD9C"}}>Medicação</h3>
              <ul className='uldoencasPac'>
                {paciente['prescriçõesRemedio'] && paciente['prescriçõesRemedio'].map((remedio, index) => (
                  <li 
                    key={index} 
                    className='cardRemedioPac'
                    onMouseEnter={(e) => handleMouseEnter(e, remedio, 'remedio')}
                    onMouseLeave={handleMouseLeave}                              
                  >
                    <p className='textRemediosprofile'>{remedio.nome}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {hoveredRemedio && (
            <div className='popupRemedios' style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}>
              <p><strong>Data da prescrição:</strong> {hoveredRemedio.dataPrescricao}</p>
              <p><strong>Observação:</strong> {hoveredRemedio.observacao}</p>
              <p><strong>Prescrito por:</strong> {hoveredRemedio.prescritoPor}</p>
            </div>
          )}
          {hoveredDoenca && (
            <div className='popup' style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}>
              <p><strong>Data da prescrição:</strong> {hoveredDoenca.dataPrescricao}</p>
              <p><strong>Prescrito por:</strong> {hoveredDoenca.prescritoPor}</p>
            </div>
          )}
          <div className='biografia-container'>
            <div className='espaçoBio'>
              <h3 className='h3Bio'>Biografia</h3>
              <p>{paciente.biografia}</p>
            </div>
            <div>
              <h3 className='h3Bio'>Hábitos</h3>
              <ul className='uldoencasPac'>
                {paciente.habitos && Array.isArray(paciente.habitos) && paciente.habitos.map((habito, index) => (
                  <li key={index} style={{marginRight: "10px"}}>
                    {habito}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPaciente;

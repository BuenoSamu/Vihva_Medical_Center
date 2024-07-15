// src/components/Medicamentos.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import './Medicamentos.css';
import Navbar from "./Navbar";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "remedios"));
        const remediosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(remediosData);
        setMedicamentos(remediosData);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentos();
  }, []);

  return (
    <div className="medicamentos-container">
      <Navbar />
      {medicamentos.map((medicamento) => (
        <div key={medicamento.id} className="card">
          {medicamento.Url ? (
            <img src={medicamento.Url} alt={medicamento.nome} className="card-image" />
          ) : (
            <div className="card-no-image">Imagem não disponível</div>
          )}
          <div className="card-content">
            <h3>{medicamento.nome}</h3>
            <p>{medicamento.descricao}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Medicamentos;

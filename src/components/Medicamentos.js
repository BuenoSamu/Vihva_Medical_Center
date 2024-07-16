import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where, orderBy, startAt, endAt } from "firebase/firestore";
import './Medicamentos.css';
import Navbar from "./Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const medicamentosRef = collection(db, "remedios");
        let queryRef;

        // Se houver um termo de pesquisa, aplicar filtro
        if (searchTerm !== '') {
          const searchTermLower = searchTerm.toLowerCase();
          queryRef = query(
            medicamentosRef,
            orderBy("nomeLowerCase"),
            startAt(searchTermLower),
            endAt(searchTermLower + '\uf8ff')
          );
        } else {
          queryRef = query(medicamentosRef);
        }

        const querySnapshot = await getDocs(queryRef);
        const remediosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          Url: doc.data().Url
        }));
        setMedicamentos(remediosData);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentos();
  }, [searchTerm]);

  // Configurações do carrossel (react-slick)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (id) => {
    navigate(`/medicamento/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Pesquisar medicamentos..."
          className="search-bar-input"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="carousel-container">
        <Slider {...settings}>
          {medicamentos.map((medicamento) => (
            <div key={medicamento.id} className="card" onClick={() => handleCardClick(medicamento.id)}>
              {medicamento.Url ? (
                <img src={medicamento.Url} alt={medicamento.nome} className="card-image" />
              ) : (
                <div className="card-no-image">Imagem não disponível</div>
              )}
              <div className="card-content">
                <h3>{medicamento.nome}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Medicamentos;

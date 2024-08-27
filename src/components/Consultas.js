import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, startAt, endAt, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import Calendar from 'react-calendar';
import Navbar from './Navbar';

const Consultas = () => {
    const [consultas, setConsultas] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [calendario, setCalendario] = useState(null);
    const [date, setDate] = useState(new Date());
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Adicionei isso para lidar com a busca

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const pacientesRef = collection(db, "pacientes");
                let queryRef;

                if (searchTerm !== '') {
                    const searchTermLower = searchTerm.toLowerCase();
                    queryRef = query(
                        pacientesRef,
                        orderBy("nomeLowerCase"),
                        startAt(searchTermLower),
                        endAt(searchTermLower + '\uf8ff')
                    );
                } else {
                    queryRef = query(pacientesRef);
                }

                const querySnapshot = await getDocs(queryRef);
                const pacientesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    nome: doc.data().nome,
                    Url: doc.data().Url,
                    sobrenome: doc.data().sobrenome,
                }));
                setPacientes(pacientesData);
            } catch (error) {
                console.error("Erro ao buscar pacientes:", error);
            }
        };

        fetchPacientes();
    }, [searchTerm]); 
    

    return (
        <>
            <Navbar />
            <div>
                <h1>Marcar consultas</h1>
                <Calendar
                    onChange={setDate}
                    value={date}
                />
                <p>Data selecionada: {date.toDateString()}</p>
            </div>
        </>
    );
}

export default Consultas;

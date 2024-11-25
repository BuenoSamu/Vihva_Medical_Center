import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Lembretes.css';
import Navbar from './Navbar';
import { motion } from 'framer-motion'; 

const Lembretes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminders, setReminders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const loginOpacityAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        delay: 0.1,
        ease: 'easeOut',
        duration: 0.5,
      },
    },
  };

  const fetchReminders = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const userDoc = await getDoc(doc(db, 'medicos', user.uid));

      if (userDoc.exists()) {
        setReminders(userDoc.data().reminders || []);
      }
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const addReminder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const newReminder = { title, content };
      const userRef = doc(db, 'medicos', user.uid);

      await updateDoc(userRef, {
        reminders: arrayUnion(newReminder)
      });

      setReminders([...reminders, newReminder]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Erro ao adicionar lembrete:', error);
    }
  };

  const deleteReminder = async (reminder) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const userRef = doc(db, 'medicos', user.uid);

      await updateDoc(userRef, {
        reminders: arrayRemove(reminder)
      });

      setReminders(reminders.filter((r) => r !== reminder));
    } catch (error) {
      console.error('Erro ao excluir lembrete:', error);
    }
  };

  const startEditReminder = (index) => {
    setEditIndex(index);
    setEditTitle(reminders[index].title);
    setEditContent(reminders[index].content);
  };

  const saveEditReminder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const updatedReminders = [...reminders];
      updatedReminders[editIndex] = { title: editTitle, content: editContent };

      const userRef = doc(db, 'medicos', user.uid);

      await updateDoc(userRef, {
        reminders: updatedReminders
      });

      setReminders(updatedReminders);
      setEditIndex(null);
      setEditTitle('');
      setEditContent('');
    } catch (error) {
      console.error('Erro ao salvar edição do lembrete:', error);
    }
  };

  return (
    <div className='containerLembretes'>
      <div className='add-reminder-container'>
        <h3>Adicionar Lembrete</h3>
        <p className='pLembrete'>
          Adicione seus lembretes para não esquecer de suas futuras tarefas!
        </p>
        <input
          className='inputLembre'
          type='text'
          placeholder='Título'
          value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className='inputLembre'
          placeholder='Conteúdo'
          value={content}
          onChange={(e) => setContent(e.target.value)} />
        <button className='buttonLogin' onClick={addReminder}>Adicionar</button>
      </div>
      <div className='reminder-list-section'>
        <h1>Lembretes</h1>
        <div className='reminder-list-container'>
          {reminders.map((reminder, index) => (
            <div key={index} className='reminder-item'>
              {editIndex === index ? (
                <div className="edit-mode">
                  <h2>Editar</h2>
                  <input
                    type='text'
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)} />
                  <button onClick={saveEditReminder} className="edit-button">Salvar</button>
                </div>
              ) : (
                <>
                  <h4>{reminder.title}</h4>
                  <p className='pLembrete'>{reminder.content}</p>
                  <div className='button-container'>
                    <button onClick={() => startEditReminder(index)} className="edit-button">Editar</button>
                    <button onClick={() => deleteReminder(reminder)} className="delete-button">Excluir</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default Lembretes;

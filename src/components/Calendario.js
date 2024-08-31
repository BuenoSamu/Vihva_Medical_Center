import React, { useState } from 'react';
import './Calendario.css'; // Importando o CSS para o estilo

const Calendario = ({ selectedDate, onChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (month, year) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstDayOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)).getUTCDay();
  const days = [];
  const totalDays = daysInMonth(currentDate.getUTCMonth(), currentDate.getUTCFullYear());

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // Preenchendo os dias vazios antes do primeiro dia do mês
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const handleDateClick = (day) => {
    if (day) {
      const selected = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), day));
      onChange(selected); // Atualiza a data selecionada no componente pai
    }
  };

  const prevMonth = () => {
    const prev = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1));
    setCurrentDate(prev);
  };

  const nextMonth = () => {
    const next = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1));
    setCurrentDate(next);
  };

  // Função para normalizar a data para meia-noite e remover o efeito de fuso horário
  const normalizeDate = (date) => {
    if (!date) return null;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <div>
          {currentDate.toLocaleString('default', { month: 'long' })} - {currentDate.getUTCFullYear()}
        </div>
        <button onClick={nextMonth}>▶</button>
      </div>
      <div className="calendar-grid">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          // Normaliza as datas para comparação exata
          const normalizedSelectedDate = normalizeDate(selectedDate);
          const currentDayDate = day ? new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), day)) : null;

          const isSelected = normalizedSelectedDate && currentDayDate && normalizedSelectedDate.getTime() === currentDayDate.getTime();

          return (
            <div
              key={index}
              className={`calendar-day ${day ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendario;

import React from 'react';
import './TaskCard.css';
import Button from '../UI/Button';

const TaskCard = ({children}) => {
  return (
    <div className="task-card">
      <span className='title'>{children}</span>
      <div className='button-container'>
        <Button>Zur Aufgabe</Button>
        <Button>Musterlösung</Button>
      </div>
    </div>
  );
};

export default TaskCard;
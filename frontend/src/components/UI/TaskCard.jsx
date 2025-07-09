import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import Button from '../UI/Button';

const TaskCard = ({children, buttonMode = 0}) => {
  const [firstButton, setFirstButton] = useState("disabled");
  const [secondButton, setSecondButton] = useState("disabled");

  useEffect(() => {
    if (buttonMode >= 1) {
      setFirstButton("")
    }
    if (buttonMode >= 2) {
      setSecondButton("")
    }
  }, [buttonMode]);

  return (
    <div className="task-card">
      <span className='title'>{children}</span>
      <div className='button-container'>
        <Button className={firstButton}>Zur Aufgabe</Button>
        <Button className={secondButton}>Musterlösung</Button>
      </div>
    </div>
  );
};

export default TaskCard;
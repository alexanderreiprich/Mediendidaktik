import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const TaskCard = ({children, id = 1}) => {
  const [firstButton, setFirstButton] = useState(<Button className="disabled">Zur Aufgabe</Button>);
  const [secondButton, setSecondButton] = useState(<Button className="disabled">Musterlösung</Button>);

  //Prüft, ob Inhalt verfügbar ist, und aktiviert dementsprechende Buttons
  const initButtons = (url, btnNr) => {
    const resp = fetch(url, {
        method: "GET",
        credentials: "include" // wichtig für Cookies / Session
    })
        .then(response => {
            if (response.status !== 204) {
                // Inhalt vorhanden, Button aktivieren
                if (btnNr === 1){
                  setFirstButton(<Link to={`/code/${id}`}><Button>Zur Aufgabe</Button></Link>)
                }
                else {
                  setSecondButton(<Link to={`/code/${id}/sample`}><Button>Musterlösung</Button></Link>)
                }
                return response.json();
            }
            return null;
        })
        .catch(error => console.error("Fetch error:", error));
  }

  useEffect(() => {
    initButtons("http://localhost:3000/api/task/" + id, 1)
    initButtons("http://localhost:3000/api/task/" + (id + 1), 2)
  }, []);

  return (
    <div className="task-card">
      <span className='title'>{children}</span>
      <div className='button-container'>
        {firstButton}
        {secondButton}
      </div>
    </div>
  );
};

export default TaskCard;
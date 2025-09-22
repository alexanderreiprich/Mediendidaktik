import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const TaskCard = ({ children, id = 1 }) => {
  const [taskDone, setTaskDone] = useState(false); // Aufgabe N bearbeitet?
  const [prevTaskDone, setPrevTaskDone] = useState(false); // Aufgabe N-1 bearbeitet?

  // Prüfen ob eine Aufgabe bearbeitet wurde (Datei existiert)
  const checkTaskDone = async (taskId) => {
    try {
      const resp = await fetch(`https://hci-lti-lernapp.imn.htwk-leipzig.de/backend/api/task/${taskId}`, {
        method: "GET",
        credentials: "include",
      });
      return resp.status !== 204; // 204 = nichts gespeichert → nicht erledigt
    } catch (err) {
      console.error("Fetch error:", err);
      return false;
    }
  };

  useEffect(() => {
    // Aufgabe N prüfen
    checkTaskDone(id).then(setTaskDone);

    // Wenn es eine vorherige Aufgabe gibt, die prüfen
    if (id > 1) {
      checkTaskDone(id - 1).then(setPrevTaskDone);
    } else {
      setPrevTaskDone(true); // Aufgabe 1 ist immer frei
    }
  }, [id]);

  return (
    <div className="task-card">
      <span className="title">{children}</span>
      <div className="button-container">
        {/* Zur Aufgabe */}
        {prevTaskDone ? (
          <Link to={`/code/${id}`}>
            <Button>Zur Aufgabe</Button>
          </Link>
        ) : (
          <Button className="disabled">Zur Aufgabe</Button>
        )}

        {/* Musterlösung */}
        {taskDone ? (
          <Link to={`/code/${id}/sample`}>
            <Button>Musterlösung</Button>
          </Link>
        ) : (
          <Button className="disabled">Musterlösung</Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
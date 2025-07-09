import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import TaskCard from '../UI/TaskCard';

const LandingPage = () => {

    useEffect(() => {
        fetch("http://localhost:3000/api/task/1", {
            method: "GET",
            credentials: "include" // wichtig für Cookies / Session
        })
            .then(response => {
                if (response.status === 204) {
                    // Kein Inhalt – entsprechend behandeln
                    console.log("No content (204)");
                    return null;
                }
                return response.json();
            })
            .catch(error => console.error("Fetch error:", error));
    }, []);

  return (
    <div className="landing-page">
      <div>
        <TaskCard buttonMode={2}>Aufgabe 1</TaskCard>
        <TaskCard buttonMode={1}>Aufgabe 2</TaskCard>
        <TaskCard>Aufgabe 3</TaskCard>
        <TaskCard>Aufgabe 4</TaskCard>
        <TaskCard>Aufgabe 5</TaskCard>
      </div>
    </div>
  );
};

export default LandingPage;
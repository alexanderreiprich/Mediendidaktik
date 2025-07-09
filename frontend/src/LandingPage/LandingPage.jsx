import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import TaskCard from '../UI/TaskCard';

const LandingPage = () => {
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
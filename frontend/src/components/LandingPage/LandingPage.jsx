import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import TaskCard from '../UI/TaskCard';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div>
        <TaskCard id={1}>Aufgabe 1</TaskCard>
        <TaskCard id={2}>Aufgabe 2</TaskCard>
        <TaskCard id={3}>Aufgabe 3</TaskCard>
        <TaskCard id={4}>Aufgabe 4</TaskCard>
        <TaskCard id={5}>Aufgabe 5</TaskCard>
      </div>
    </div>
  );
};

export default LandingPage;
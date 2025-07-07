import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import TaskCard from '../UI/TaskCard';

const LandingPage = () => {
  //const [htmlCode, setHtmlCode] = useState('<!-- Gib hier deinen HTML-Code ein -->\n<h1>Mein Code-Playground</h1>\n<p>Bearbeite HTML, CSS und JavaScript und sieh dir das Ergebnis an!</p>\n<button id="testButton">Klick mich!</button>');
  
  /*useEffect(() => {
    const combined = combineCode(htmlCode, cssCode, jsCode);
    setCombinedCode(combined);
  }, [htmlCode, cssCode, jsCode]);*/

  return (
    <div className="landing-page">
      <div>
        <TaskCard>Aufgabe 1</TaskCard>
        <TaskCard>Aufgabe 2</TaskCard>
        <TaskCard>Aufgabe 3</TaskCard>
        <TaskCard>Aufgabe 4</TaskCard>
        <TaskCard>Aufgabe 5</TaskCard>
      </div>
    </div>
  );
};

export default LandingPage;
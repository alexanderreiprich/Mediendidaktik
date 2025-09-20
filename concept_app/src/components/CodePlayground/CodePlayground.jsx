import React, { useState, useEffect } from 'react';
import Editor from './Editor/Editor';
import Preview from './Preview/Preview';
import Button from '../UI/Button';
import { combineCode, extractCode } from '../../utils/codeUtils';
import './CodePlayground.css';

const CodePlayground = () => {
  const [htmlCode, setHtmlCode] = useState('<!-- Gib hier deinen HTML-Code ein -->\n<h1>Mein Code-Playground</h1>\n<p>Bearbeite HTML, CSS und JavaScript und sieh dir das Ergebnis an!</p>\n<button id="testButton">Klick mich!</button>');
  
  const [cssCode, setCssCode] = useState('/* Gib hier deinen CSS-Code ein */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\nbutton {\n  padding: 8px 16px;\n  background-color: #4CAF50;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #45a049;\n}');
  
  const [jsCode, setJsCode] = useState('// Gib hier deinen JavaScript-Code ein\ndocument.getElementById("testButton").addEventListener(\n "click", () => {\n  console.log("hi")\n }\n);\n');
  
  const [combinedCode, setCombinedCode] = useState('');

  const [editorVisible, setEditorVisible] = useState(true);

  const toggleEditor = () => {
    setEditorVisible(prevState => !prevState);
  }

  const handleLoadTask = async () => {
    try {
      const response = await fetch('/hci-app-first-exercise.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();
      const codeParts = extractCode(htmlContent);
      
      if (!codeParts.html && !codeParts.css && !codeParts.js) {
        throw new Error('Keine Code-Teile gefunden in der HTML-Datei');
      }
      
      // return the aprts to the parent
      handleCodeLoad(codeParts.html, codeParts.css, codeParts.js);
    } catch (error) {
      console.error('Fehler beim Laden der Datei:', error);
      alert('Fehler beim Laden der Datei: ' + error.message);
    }
  };

  useEffect(() => {
    const combined = combineCode(htmlCode, cssCode, jsCode);
    setCombinedCode(combined);
  }, [htmlCode, cssCode, jsCode]);

  const handleHtmlChange = (newCode) => {
    setHtmlCode(newCode);
  };

  const handleCssChange = (newCode) => {
    setCssCode(newCode);
  };

  const handleJsChange = (newCode) => {
    setJsCode(newCode);
  };

  const handleCodeLoad = (html, css, js) => {
    setHtmlCode(html);
    setCssCode(css);
    setJsCode(js);
  };

  return (
    <div className="code-playground">
      <header className="playground-header">
        <h1>Code Playground</h1>
        <div className="editor-actions">
          <Button onClick={toggleEditor}>{
            editorVisible ? "Editor verstecken" : "Editor anzeigen"
          }</Button>
          <Button onClick={handleLoadTask}>{
            "Aufgabe laden"
          }</Button>
        </div>
      </header>
      
      <div className="playground-content">
        {editorVisible && (
          <Editor 
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            onHtmlChange={handleHtmlChange}
            onCssChange={handleCssChange}
            onJsChange={handleJsChange}
          />
        )}
        
        <Preview code={combinedCode} />
      </div>
    </div>
  );
};

export default CodePlayground;
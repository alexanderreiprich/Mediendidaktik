import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from './Editor/Editor';
import Preview from './Preview/Preview';
import Button from '../UI/Button';
import { combineCode, extractCode } from '../../utils/codeUtils';
import './CodePlayground.css';

const CodePlayground = ({sample = false}) => {
  const params = useParams();

  const [htmlCode, setHtmlCode] = useState('<!-- Gib hier deinen HTML-Code ein -->\n<h1>Mein Code-Playground</h1>\n<p>Bearbeite HTML, CSS und JavaScript und sieh dir das Ergebnis an!</p>\n<p>Dein Code wird automatisch gespeichert.</p>\n<button id="testButton">Klick mich!</button>');

  const [cssCode, setCssCode] = useState('/* Gib hier deinen CSS-Code ein */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\nbutton {\n  padding: 8px 16px;\n  background-color: #4CAF50;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #45a049;\n}');

  const [jsCode, setJsCode] = useState('// Gib hier deinen JavaScript-Code ein\ndocument.getElementById("testButton").addEventListener(\n "click", () => {\n  console.log("hi")\n }\n);\n');

  const [combinedCode, setCombinedCode] = useState('');

  const [editorVisible, setEditorVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCode, setModalCode] = useState('');

  const toggleEditor = () => {
    setEditorVisible(prevState => !prevState);
  }

  // Gespeicherter Content oder Sample laden
  const handleLoadTask = async () => {
    setModalCode(combinedCode);
    setIsModalOpen(true);
  };

  async function saveTask(html, css, js) {
    try {
      await fetch(`http://localhost:3000/api/task/${params.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, css, js })
      });
      console.log("Autosaved!");
    } catch (err) {
      console.error("Autosave failed", err);
    }
  }

  useEffect(() => {
      const combined = combineCode(htmlCode, cssCode, jsCode);
      setCombinedCode(combined);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    if (sample) return; // Kein Autosave im Sample-Modus

    // debounce: speichere nach 5s Ruhe
    const debounceTimer = setTimeout(() => {
      saveTask(htmlCode, cssCode, jsCode);
    }, 5000);

    // throttle: alle 30s speichern, egal was passiert
    const throttleTimer = setInterval(() => {
      saveTask(htmlCode, cssCode, jsCode);
    }, 30000);

    return () => {
      clearTimeout(debounceTimer);
      clearInterval(throttleTimer);
    };
  }, [htmlCode, cssCode, jsCode, sample]);

  const handleHtmlChange = (newCode) => {
    setHtmlCode(newCode);
  };

  const handleCssChange = (newCode) => {
    setCssCode(newCode);
  };

  const handleJsChange = (newCode) => {
    setJsCode(newCode);
  };

  const handleCopyCombinedCode = async () => {
    try {
      await navigator.clipboard.writeText(modalCode || combinedCode);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveImportedCode = () => {
    const { html, css, js } = extractCode(modalCode);
    setHtmlCode(html);
    setCssCode(css);
    setJsCode(js);
    setIsModalOpen(false);
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
            "Import/Export"
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

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Import/Export</h2>
              <Button onClick={handleCloseModal}>Schließen</Button>
            </div>
            <div className="modal-body">
              <textarea
                value={modalCode}
                onChange={(e) => setModalCode(e.target.value)}
                className="modal-textarea"
              />
            </div>
            <div className="modal-footer">
              <Button onClick={handleCopyCombinedCode}>In Zwischenablage kopieren</Button>
              <Button onClick={handleSaveImportedCode}>Speichern</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
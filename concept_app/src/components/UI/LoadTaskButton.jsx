import { extractCode } from '../../utils/codeUtils';

const LoadTaskButton = ({ onCodeLoad }) => {
  const handleLoadTask = async () => {
    try {
      const response = await fetch('/hci-app.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();
      const codeParts = extractCode(htmlContent);
      
      if (!codeParts.html && !codeParts.css && !codeParts.js) {
        throw new Error('Keine Code-Teile gefunden in der HTML-Datei');
      }
      
      // return the aprts to the parent
      onCodeLoad(codeParts.html, codeParts.css, codeParts.js);
    } catch (error) {
      console.error('Fehler beim Laden der Datei:', error);
      alert('Fehler beim Laden der Datei: ' + error.message);
    }
  };

  return (
    <button 
      onClick={handleLoadTask}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Aufgabe laden
    </button>
  );
};

export default LoadTaskButton;
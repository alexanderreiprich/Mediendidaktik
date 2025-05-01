import React from 'react';
import './Preview.css';

const Preview = ({ code }) => {
  return (
    <div className="preview-pane">
      <div className="preview-header">
        <h2>Ausgabe</h2>
      </div>
      <div className="preview-content">
        <iframe
          srcDoc={code}
          title="output"
          className="preview-iframe"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default Preview;
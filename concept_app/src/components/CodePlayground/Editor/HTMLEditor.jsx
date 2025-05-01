import React from 'react';

const HtmlEditor = ({ code, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      className="code-editor html-editor"
      value={code}
      onChange={handleChange}
      placeholder="Gib hier HTML-Code ein"
    />
  );
};

export default HtmlEditor;
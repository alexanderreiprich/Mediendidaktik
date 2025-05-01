import React from 'react';

const JsEditor = ({ code, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      className="code-editor js-editor"
      value={code}
      onChange={handleChange}
      placeholder="Gib hier JavaScript-Code ein"
    />
  );
};

export default JsEditor;
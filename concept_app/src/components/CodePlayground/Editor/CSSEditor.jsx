import React from 'react';

const CssEditor = ({ code, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      className="code-editor css-editor"
      value={code}
      onChange={handleChange}
      placeholder="Gib hier CSS-Code ein"
    />
  );
};

export default CssEditor;
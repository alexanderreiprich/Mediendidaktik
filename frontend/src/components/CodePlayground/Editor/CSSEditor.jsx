import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';

const CssEditor = ({ code, onChange }) => {
  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[css()]}
      onChange={(value) => onChange(value)}
      theme="dark"
      className="code-editor css-editor"
      placeholder="Gib hier CSS-Code ein"
    />
  );
};

export default CssEditor;
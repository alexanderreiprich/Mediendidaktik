import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

const HtmlEditor = ({ code, onChange }) => {
  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[html()]}
      onChange={(value) => onChange(value)}
      theme="dark"
      className="code-editor html-editor"
      placeholder="Gib hier HTML-Code ein"
    />
  );
};

export default HtmlEditor;
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const JsEditor = ({ code, onChange }) => {
  return (
    <CodeMirror
      value={code}
      height="200px"
      extensions={[javascript()]}
      onChange={(value) => onChange(value)}
      theme="dark"
      className="code-editor js-editor"
      placeholder="Gib hier JavaScript-Code ein"
    />
  );
};

export default JsEditor;
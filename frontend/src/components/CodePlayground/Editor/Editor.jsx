import React, { useState } from 'react';
import EditorTabs from './EditorTabs';
import HtmlEditor from './HTMLEditor';
import CssEditor from './CSSEditor';
import JsEditor from './JsEditor';
import './Editor.css';

const Editor = ({ htmlCode, cssCode, jsCode, onHtmlChange, onCssChange, onJsChange }) => {
  const [activeTab, setActiveTab] = useState('html');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="editor-pane">
      <EditorTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="editor-content">
        {activeTab === 'html' && (
          <HtmlEditor code={htmlCode} onChange={onHtmlChange} />
        )}
        
        {activeTab === 'css' && (
          <CssEditor code={cssCode} onChange={onCssChange} />
        )}
        
        {activeTab === 'js' && (
          <JsEditor code={jsCode} onChange={onJsChange} />
        )}
      </div>
    </div>
  );
};

export default Editor;
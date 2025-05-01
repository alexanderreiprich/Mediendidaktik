import React from 'react';

const EditorTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="editor-tabs">
      <button 
        className={`editor-tab ${activeTab === 'html' ? 'active' : ''}`}
        onClick={() => onTabChange('html')}
      >
        HTML
      </button>
      <button 
        className={`editor-tab ${activeTab === 'css' ? 'active' : ''}`}
        onClick={() => onTabChange('css')}
      >
        CSS
      </button>
      <button 
        className={`editor-tab ${activeTab === 'js' ? 'active' : ''}`}
        onClick={() => onTabChange('js')}
      >
        JavaScript
      </button>
    </div>
  );
};

export default EditorTabs;
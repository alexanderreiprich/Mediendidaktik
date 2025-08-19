import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from './components/LandingPage';
import CodePlayground from './components/CodePlayground';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/code/:id" element={<CodePlayground />} />
          <Route path="/code/:id/sample" element={<CodePlayground sample={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
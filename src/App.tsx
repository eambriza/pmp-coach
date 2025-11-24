import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PracticeProvider } from './contexts/PracticeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import ResultsPage from './pages/ResultsPage';
import ProgressPage from './pages/ProgressPage';
import './styles/glassmorphism.css';
export function App() {
  return <Router>
      <ProgressProvider>
        <PracticeProvider>
          <div className="app-container min-h-screen" style={{
          background: 'linear-gradient(135deg, #1F1C2C 0%, #0E94B4 100%)'
        }}>
            <div className="stars-container">
              <div className="stars"></div>
              <div className="stars2"></div>
              <div className="stars3"></div>
            </div>
            <div className="glass-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/practice" element={<PracticePage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </PracticeProvider>
      </ProgressProvider>
    </Router>;
}
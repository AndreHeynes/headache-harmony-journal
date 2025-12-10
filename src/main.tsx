import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { EpisodeProvider } from './contexts/EpisodeContext';
import { BetaSessionProvider } from './contexts/BetaSessionContext';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <BetaSessionProvider>
        <AuthProvider>
          <EpisodeProvider>
            <App />
          </EpisodeProvider>
        </AuthProvider>
      </BetaSessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { EpisodeProvider } from './contexts/EpisodeContext';
import { LocationProvider } from './contexts/LocationContext';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EpisodeProvider>
          <LocationProvider>
            <App />
          </LocationProvider>
        </EpisodeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

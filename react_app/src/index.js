import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


const AppContainer = () => {
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        // Pobieramy plik api.txt z katalogu public
        const response = await fetch("/config/api.txt");

        if (!response.ok) {
          throw new Error("Nie udało się załadować pliku konfiguracyjnego");
        }
        const text = await response.text();

        // Dzielimy zawartość na linie
        const lines = text.split("\n");
        let id = "";
        // Przeszukujemy linie w poszukiwaniu wpisu dla google_auth
        for (let line of lines) {
          line = line.trim();
          
          if (line.startsWith("google_auth=")) {
            id = line.split("=")[1].trim();
            break;
          }
        }
        if (!id) {
          throw new Error("Nie znaleziono wpisu 'google_auth'");
        }
        setClientId(id);
      } catch (error) {
        console.error("Błąd pobierania clientId:", error);
      }
    };

    fetchClientId();
  }, []);

  if (!clientId) {
    return <div>Ładowanie konfiguracji… </div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

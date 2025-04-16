
// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funkcja do rejestracji przez tradycyjny formularz
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        email,
        password,
      });
      alert(`Zarejestrowano użytkownika: ${response.data.user.email}`);
      // Możesz zapisać token lub przekierować użytkownika itp.
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      alert('Wystąpił błąd podczas rejestracji.');
    }
  };

  // Obsługa logowania Google (opcja rejestracji przez Google)
  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      // Wysyłamy token do backendu do rejestracji/logowania
      const response = await axios.post('http://localhost:8000/auth/google', { token });
      alert(`Zarejestrowano użytkownika: ${response.data.user.email}`);
      // Zapisz token i/lub przekieruj użytkownika
    } catch (error) {
      console.error('Błąd podczas rejestracji przez Google:', error);
      alert('Wystąpił błąd podczas rejestracji.');
    }
  };

  const handleGoogleRegisterFailure = (error) => {
    console.error('Google Register Failure:', error);
    alert('Błąd rejestracji przez Google.');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister} style={{ marginBottom: '1rem' }}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Podaj email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Podaj hasło"
            required
          />
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
      <div>
        <h3>Lub zarejestruj się przez Google:</h3>
        <GoogleLogin
          onSuccess={handleGoogleRegisterSuccess}
          onError={handleGoogleRegisterFailure}
          useOneTap
          redirectUri="http://localhost:3000"
        />
      </div>
    </div>
  );
};

export default RegisterPage;

// src/pages/LoginPage.js
import React from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  // Funkcja, która zostanie wywołana po udanym logowaniu przez Google
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      // Wysyłamy token do backendu do weryfikacji i logowania użytkownika
      const response = await axios.post('http://localhost:8000/auth/google', { token });
      alert(`Zalogowano: ${response.data.user.email}`);
      // Możesz zapisać otrzymany token, przekierować użytkownika itp.
    } catch (error) {
      console.error('Błąd podczas logowania przez Google:', error);
      alert('Wystąpił błąd podczas logowania.');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google Login Failure:', error);
    alert('Błąd logowania przez Google.');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Logowanie</h2>
      <div style={{ marginBottom: '1rem' }}>
        {/* Standardowy formularz logowania (opcjonalnie) */}
        {/* Możesz tu dodać formularz do logowania przez email/password */}
      </div>
      <div>
        <h3>Lub zaloguj się przez Google:</h3>
        <GoogleLogin 
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </div>
    </div>
  );
};

export default LoginPage;

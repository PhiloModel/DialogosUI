import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000/', // Adres Twojego backendu
});

export const sendMessage = async (message) => {
  try {
    // Przykładowy endpoint, np. 'chat'
    const response = await api.post('chat', { message });
    return response.data; // zakładamy, że backend zwraca { reply: "tekst" }
  } catch (error) {
    console.error('Błąd podczas wysyłania wiadomości:', error);
    throw error;
  }
};

export const fetchData = async () => {
  try {
    const response = await api.get('endpoint/');
    return response.data;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    throw error;
  }
};

import { useState } from "react";
import { Button, TextField } from '@mui/material';
import axios from "axios";

export default function CreateRAG({ selectedModels }) {
  const [ragName, setRagName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRAG = async () => {
    if (!ragName.trim()) {
      alert("Podaj nazwę dla RAG");
      return;
    }
    if (!selectedModels || selectedModels.length === 0) {
      alert("Wybierz przynajmniej jeden plik");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Nie znaleziono tokenu autoryzacyjnego. Zaloguj się ponownie.");
      }

      // Create FormData for multiple files
      const formData = new FormData();
      formData.append("rag_name", ragName);
      
      // Append each selected model as a separate field with the same name
      selectedModels.forEach(model => {
        formData.append("selected_model", model);
      });

      console.log('Sending selected models:', selectedModels); // Debug log

      const response = await axios.post(
        "http://localhost:8000/chatbot/create_rag", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (response.data && response.data.reply) {
        alert(response.data.reply);
        setRagName("");
      }

    } catch (error) {
      console.error("Błąd podczas tworzenia RAG:", error);
      
      if (error.response?.status === 401) {
        alert("Sesja wygasła. Zaloguj się ponownie.");
        window.location.href = '/login';
        return;
      }
      
      if (error.response?.status === 422) {
        const validationError = error.response.data?.detail?.[0]?.msg || 
                              'Nieprawidłowe dane żądania';
        alert(validationError);
        return;
      }
      
      const errorMessage = error.response?.data?.detail || 
                         "Wystąpił błąd podczas tworzenia RAG.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Stwórz RAG</h2>
      <TextField
        label="Nazwa RAG"
        placeholder="Wpisz nazwę RAG"
        value={ragName}
        onChange={(e) => setRagName(e.target.value)}
        disabled={loading}
        fullWidth
      />
      {selectedModels && selectedModels.length > 0 && (
        <div className="text-sm text-gray-600">
          Wybrane pliki ({selectedModels.length}): {selectedModels.join(", ")}
        </div>
      )}
      <Button 
        variant="contained" 
        onClick={handleCreateRAG} 
        disabled={loading || !ragName.trim() || !selectedModels || selectedModels.length === 0}
      >
        {loading ? "Tworzenie..." : "Stwórz RAG"}
      </Button>
    </div>
  );
}
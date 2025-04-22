import { useState } from "react";
import { Button, TextField } from '@mui/material';
import axios from "axios";

export default function CreateRAG({ selectedModel }) {
  const [ragName, setRagName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRAG = async () => {
    if (!ragName.trim()) {
      alert("Podaj nazwę dla RAG");
      return;
    }
    if (!selectedModel) {
      alert("Wybierz najpierw pliki (model)");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rag_name", ragName);
      formData.append("selected_model", selectedModel);

      const response = await axios.post("http://localhost:8000/chatbot/create_rag", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.reply);
      setRagName("");
    } catch (error) {
      console.error("Błąd podczas tworzenia RAG:", error);
      alert("Wystąpił błąd podczas tworzenia RAG.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Stwórz RAG</h2>
      <TextField
        placeholder="Wpisz nazwę RAG"
        value={ragName}
        onChange={(e) => setRagName(e.target.value)}
      />
      <Button onClick={handleCreateRAG} disabled={loading}>
        {loading ? "Tworzę..." : "Stwórz RAG"}
      </Button>
    </div>
  );
}

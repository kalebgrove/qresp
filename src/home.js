import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './home.css';

const Home = () => {
  const [profileImage, setProfileImage] = useState('/images/default-profile.jpg'); // Estado para la imagen de perfil
  const [availableMPIDs] = useState([
    "Alveolitis Al·lèrgica Extrínseca",
    "Bronquiolitis Obliterant",
    "Fibrosi Pulmonar Associada a Esclerodèrmia",
    "Fibrosi Pulmonar Associada a Malalties del Teixit Connectiu",
    "Fibrosi Pulmonar Associada a Sarcoïdosi Crònica",
    "Fibrosi Pulmonar Familiar",
    "Fibrosi Pulmonar Idiopàtica (FPI)",
    "Fibrosi Pulmonar Post-COVID-19",
    "Fibrosi Pulmonar Post-Radioteràpia",
    "Fibrosi Pulmonar Secundària a Pneumònia Organitzada",
    "Granulomatosi Amb Poliangiitis (Granulomatosi de Wegener)",
    "Hemorràgia Pulmonar Induïda per Lupus Eritematós Sistèmic",
    "Histiocitosi de Cèl·lules de Langerhans",
    "Histiocitosi Pulmonar Cel·lular",
    "Limfangioleiomiomatosi (LAM)",
    "Limfangitis Carcinomatosa",
    "Malaltia de Wilson Amb Afectació Pulmonar",
    "Malaltia Pulmonar Associada a la Síndrome d’Ehlers-Danlos",
    "Malaltia Pulmonar Granulomatosa Crònica",
    "Malaltia Pulmonar Induïda per Metotrexat",
    "Malaltia Pulmonar Intersticial Associada a Dermatomiositis o Polimiositis",
    "Malaltia Pulmonar Intersticial Associada a Sjögren",
    "Malaltia Pulmonar Mixta (Restrictiva i Obstructiva)",
    "Malaltia Pulmonar Relacionada amb Beril·liosi Crònica",
    "Malaltia Pulmonar Relacionada amb la Síndrome de Sjögren",
    "Malaltia Pulmonar Secundària a Pneumònia Organitzada",
    "Pneumoconiosi (Silicosi, Asbestosi, Pneumoconiosi del Carbó)",
    "Pneumonitis Associada a Lupus Eritematós Sistèmic",
    "Pneumonitis d’Hipersensibilitat",
    "Pneumonitis Eosinofílica Crònica",
    "Pneumonitis Induïda per Radiació",
    "Pneumonitis Limfocítica Subaguda",
    "Pneumopaties Intersticials Relacionades amb Metalls (Beril·liosi, Malaltia del Cobalt)",
    "Pneumopaties per Malalties Autoinflamatòries",
    "Pneumopaties Relacionades amb Pols de Talc",
    "Pneumònia Intersticial Descamativa",
    "Pneumònia Intersticial Limfocítica",
    "Pneumònia Intersticial no Específica (PINE)",
    "Pneumònia Organitzativa Criptogènica (COP)",
    "Proteïnosi Alveolar Pulmonar",
    "Pulmó de Carbó (Malaltia Relacionada amb la Mineria)",
    "Pulmó de Granjer (Alveolitis per Exposició a Pols de Fenc)",
    "Pulmó de Tòxic (Relacionat amb Químics Inhalats)",
    "Sarcoïdosi Pulmonar",
    "Síndrome d’Hemorràgia Pulmonar Idiopàtica",
    "Síndrome de Blau (Sarcoïdosi Familiar)",
    "Síndrome de Birt-Hogg-Dubé (Associada a Quists Pulmonars i Càncer Renal)",
    "Síndrome de Caplan (Associada a la Pneumoconiosi i l’Artritis Reumatoide)",
    "Síndrome de Churg-Strauss (Granulomatosi Eosinofílica Amb Poliangiitis)",
    "Síndrome de Felty amb Afectació Pulmonar",
    "Síndrome de Goodpasture (Hemorràgia Alveolar Difusa)",
    "Síndrome de Hermansky-Pudlak (Associada a la Fibrosi Pulmonar i Albinisme)",
    "Síndrome de Löffler (Infiltrats Eosinofílics Transitòris)"
  ]);

  const [selectedMPIDs, setSelectedMPIDs] = useState(() => {
    const savedMPIDs = Cookies.get("mpids");
    return savedMPIDs ? JSON.parse(savedMPIDs) : [];
  });

  const [currentMPID, setCurrentMPID] = useState("");
  const [step, setStep] = useState("select");
  const [questions, setQuestions] = useState([
    { id: 1, question: "T'ofegues sovint?", answer: "" },
    { id: 2, question: "Tens tos persistent?", answer: "" },
    { id: 3, question: "Has perdut pes últimament?", answer: "" },
    { id: 4, question: "Et sents fatigat?", answer: "" },
    { id: 5, question: "Tens molts mocs?", answer: "" },
  ]);

  const [result, setResult] = useState("");

  useEffect(() => {
    // Recupera la imagen de perfil desde localStorage
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const saveMPIDs = (mpids) => {
    Cookies.set("mpids", JSON.stringify(mpids), { expires: 365 });
  };

  const handleSelectMPID = () => {
    if (currentMPID && !selectedMPIDs.includes(currentMPID)) {
      const updatedMPIDs = [...selectedMPIDs, currentMPID];
      setSelectedMPIDs(updatedMPIDs);
      saveMPIDs(updatedMPIDs);
    }
    setCurrentMPID("");
  };

  const handleDeselectMPID = (mpid) => {
    const updatedMPIDs = selectedMPIDs.filter((selected) => selected !== mpid);
    setSelectedMPIDs(updatedMPIDs);
    saveMPIDs(updatedMPIDs);
  };

  const handleAnswerChange = (id, answer) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, answer } : q
    );
    setQuestions(updatedQuestions);
  };

  const calculateResult = () => {
    const positiveAnswers = questions.filter((q) => q.answer === "yes").length;

    if (positiveAnswers >= 2) {
      setResult(`Consulta mèdica urgent recomanada amb els MPIDs seleccionats (${selectedMPIDs.join(", ")})`);
    } else {
      setResult(`Els MPIDs seleccionats (${selectedMPIDs.join(", ")}) no indiquen urgència immediata.`);
    }
  };

  return (
    <div className="home-container">
      <div className="profile-button-container">
        <a href="http://localhost:3000/profile">
          <div className="profile-button">
            <img src={profileImage} alt="Perfil" />
          </div>
        </a>
      </div>

      {step === "select" && (
        <div className="mpid-selector">
          <h2>Seleccioneu les vostres MPIDs</h2>
          <div className="dropdown-container">
            <select
              value={currentMPID}
              onChange={(e) => setCurrentMPID(e.target.value)}
            >
              <option value="">Seleccionar MPID</option>
              {availableMPIDs.map((mpid) => (
                <option key={mpid} value={mpid}>
                  {mpid}
                </option>
              ))}
            </select>
            <button onClick={handleSelectMPID}>Afegir</button>
          </div>
          {selectedMPIDs.length > 0 && (
            <div className="selected-mpids">
              <h3>MPIDs seleccionats:</h3>
              {selectedMPIDs.map((mpid) => (
                <span key={mpid}>
                  {mpid}{" "}
                  <button onClick={() => handleDeselectMPID(mpid)}>x</button>
                </span>
              ))}
              <button onClick={() => setStep("questionnaire")}>Continuar</button>
            </div>
          )}
        </div>
      )}

      {step === "questionnaire" && (
        <div className="questionnaire">
          <div className="header">
            <button onClick={() => setStep("select")} className="back">Tornar</button>
            <h2>Com et trobes avui?</h2>
          </div>
          <div>
            {questions.map((question) => (
              <div key={question.id} className="question-options">
                <p>{question.question}</p>
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="yes"
                    checked={question.answer === "yes"}
                    onChange={() => handleAnswerChange(question.id, "yes")}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="no"
                    checked={question.answer === "no"}
                    onChange={() => handleAnswerChange(question.id, "no")}
                  />
                  No
                </label>
              </div>
            ))}
          </div>
          <button onClick={calculateResult} className="send">Enviar</button>
          {result && <p>{result}</p>}
        </div>
      )}
    </div>
  );
};

export default Home;

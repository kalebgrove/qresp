import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './home.css';

const Home = () => {
  const [availableMPIDs] = useState([
    "Fibrosi Pulmonar Idiopàtica (FPI)",
        "Pneumonitis d’Hipersensibilitat",
        "Sarcoïdosi Pulmonar",
        "Pneumònia Intersticial no Específica (PINE)",
        "Pneumònia Organitzativa Criptogènica (COP)",
        "Limfangioleiomiomatosi (LAM)",
        "Histiocitosi de Cèl·lules de Langerhans",
        "Alveolitis Al·lèrgica Extrínseca",
        "Pneumoconiosi (Silicosi, Asbestosi, Pneumoconiosi del Carbó)",
        "Fibrosi Pulmonar Associada a Malalties del Teixit Connectiu",
        "Bronquiolitis Obliterant",
        "Proteïnosi Alveolar Pulmonar",
        "Malaltia Pulmonar Intersticial Associada a Sjögren",
        "Malaltia Pulmonar Intersticial Associada a Dermatomiositis o Polimiositis",
        "Malaltia Pulmonar Induïda per Fàrmacs (Methotrexat, Nitrofurantoïna, Amiodarona)",
        "Fibrosi Pulmonar Familiar",
        "Malaltia Pulmonar Granulomatosa Crònica",
        "Limfangitis Carcinomatosa",
        "Malaltia de Wilson Amb Afectació Pulmonar",
        "Síndrome de Goodpasture (Hemorràgia Alveolar Difusa)",
        "Síndrome de Churg-Strauss (Granulomatosi Eosinofílica Amb Poliangiitis)",
        "Granulomatosi Amb Poliangiitis (Granulomatosi de Wegener)",
        "Pneumònia Intersticial Descamativa",
        "Pneumònia Intersticial Limfocítica",
        "Fibrosi Pulmonar Post-Radioteràpia",
        "Malaltia Pulmonar Relacionada amb la Síndrome de Sjögren",
        "Hemorràgia Pulmonar Induïda per Lupus Eritematós Sistèmic",
        "Síndrome de Caplan (Associada a la Pneumoconiosi i l’Artritis Reumatoide)",
        "Síndrome de Hermansky-Pudlak (Associada a la Fibrosi Pulmonar i Albinisme)",
        "Síndrome de Birt-Hogg-Dubé (Associada a Quists Pulmonars i Càncer Renal)",
        "Síndrome de Blau (Sarcoïdosi Familiar)",
        "Pneumopaties Intersticials Relacionades amb Metalls (Beril·liosi, Malaltia del Cobalt)",
        "Fibrosi Pulmonar Associada a Esclerodèrmia",
        "Malaltia Pulmonar Associada a la Síndrome d’Ehlers-Danlos",
        "Fibrosi Pulmonar Secundària a Pneumònia Organitzada",
        "Pneumonitis Induïda per Radiació",
        "Fibrosi Pulmonar Post-COVID-19",
        "Pneumopaties per Malalties Autoinflamatòries",
        "Pneumonitis Limfocítica Subaguda",
        "Pulmó de Granjer (Alveolitis per Exposició a Pols de Fenc)",
        "Pulmó de Tòxic (Relacionat amb Químics Inhalats)",
        "Pulmó de Carbó (Malaltia Relacionada amb la Mineria)",
        "Síndrome de Löffler (Infiltrats Eosinofílics Transitòris)",
        "Malaltia Pulmonar Relacionada amb Beril·liosi Crònica",
        "Fibrosi Pulmonar Associada a Sarcoïdosi Crònica",
        "Pneumonitis Eosinofílica Crònica",
        "Pneumopaties Relacionades amb Pols de Talc",
        "Malaltia Pulmonar Induïda per Metotrexat",
        "Síndrome d’Hemorràgia Pulmonar Idiopàtica",
        "Pneumonitis Associada a Lupus Eritematós Sistèmic",
        "Pneumopatia Associada a Síndrome de Sjögren Secundari",
        "Pneumopatia Associada a Artritis Reumatoide",
        "Síndrome de Felty amb Afectació Pulmonar",
        "Histiocitosi Pulmonar Cel·lular",
        "Quists Pulmonars Associats a Malalties Intersticials",
        "Malaltia Pulmonar Mixta (Restrictiva i Obstructiva)"
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
    { id: 6, question: 'Tens el nas tapat?', answer: '' },
    { id: 7, question: 'Et fa malt la gola?', answer: '' },
    { id: 8, question: 'Tens febre?', answer: '' },
    { id: 9, question: 'Presentes dolor toràsic?', answer: '' },
    { id: 10, question: 'Sents xiulets quan respires?', answer: '' },
  ]);

  const [result, setResult] = useState("");

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
      setResult(
        `Amb les respostes seleccionades i els MPIDs (${selectedMPIDs.join(
          ", "
        )}), recomanem una consulta mèdica urgent.`
      );
    } else {
      setResult(
        `El teu estat sembla estable. Els MPIDs seleccionats (${selectedMPIDs.join(
          ", "
        )}) no indiquen una urgència immediata.`
      );
    }
  };

  return (
    <div className="home-container">
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
            <div className='header'>
                <button onClick={() => setStep("select")} className='back'>Tornar</button>
                <h2>Com et trobes avui?</h2>
                <img></img>
            </div>
          <div>
            {questions.map((question) => (
              <div key={question.id} className='question-options'>
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
          <button onClick={calculateResult} className='send'>Enviar</button>
          {result && <p>{result}</p>}
        </div>
      )}
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './home.css';
import axios from 'axios';

const Home = () => {
  const [profileImage, setProfileImage] = useState('/images/default-profile.jpg');
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
    "Pneumoconiosi (Silicosi, Asbestosi, Pneumoconiosi del Carbó)",
    "Pneumonitis Associada a Lupus Eritematós Sistèmic",
    "Pneumonitis d’Hipersensibilitat",
    "Pneumonitis Eosinofílica Crònica",
    "Pneumonitis Induïda per Radiació",
    "Pneumonitis Limfocítica Subaguda",
    "Pneumònia Organitzativa Criptogènica (COP)",
    "Sarcoïdosi Pulmonar",
    "Síndrome de Blau (Sarcoïdosi Familiar)"
  ]);

  const [selectedMPIDs, setSelectedMPIDs] = useState(() => {
    const savedMPIDs = Cookies.get("mpids");
    return savedMPIDs ? JSON.parse(savedMPIDs) : [];
  });

  const [currentMPID, setCurrentMPID] = useState("");
  const [step, setStep] = useState("select");
  const [questions, setQuestions] = useState([
    { id: 1, question: "¿Te ahogas a menudo?", answer: "" },
    { id: 2, question: "¿Tienes tos persistente?", answer: "" },
    { id: 3, question: "¿Has perdido peso últimamente?", answer: "" },
    { id: 4, question: "¿Te sientes fatigado?", answer: "" },
    { id: 5, question: "¿Tienes muchos mocos?", answer: "" },
    { id: 6, question: "¿Tienes la nariz tapada?", answer: "" },
    { id: 7, question: "¿Te duele la garganta?", answer: "" },
    { id: 8, question: "¿Tienes fiebre?", answer: "" },
    { id: 9, question: "¿Tienes dolor en el pecho?", answer: "" },
    { id: 10, question: "¿Sientes silbidos al respirar?", answer: "" },
  ]);

  const [result, setResult] = useState("");

  useEffect(() => {
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const fetchUserData = async () => {
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      console.error("No se encontró la cookie 'user'.");
      return null;
    }
    return JSON.parse(userCookie);
  };

  const sendAnswersToBackend = async () => {
    const answers = questions.map((q) => ({
      question_id: q.id,
      answer: q.answer === "yes" ? 1 : 0,
    }));


    let userC;
    let user;


    const fetchUserData = async () => {
            userC = Cookies.get("user"); // Retrieve the user's cookie
            user = JSON.parse(userC);
    };

    fetchUserData();


    try {
      console.log(user.email);
      const payload = (user.email);
      const response = await fetch("http://localhost:3000/dni-usr", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data.");

      const data = await response.json(payload);

      console.log(data.dni);

      const dataToSend = {
        dni: data.dni, // Replace with actual DNI
        mpid: selectedMPIDs,
        answers: answers,
        date: new Date().toISOString().split('T')[0],
      };
  
      try {
        console.log({dataToSend});
        // Send POST request to save the symptoms in the backend
        const postResponse = await fetch('http://localhost:3000/add-symptoms', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })
        console.log('Data sent to backend:', postResponse.data);

      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    } catch(err) {
      console.error(err);
    }
  };

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
      q.id === id ? { ...q, answer: answer === "yes" ? 1 : 0 } : q
    );
    setQuestions(updatedQuestions);
  };
  

  const calculateResult = () => {
    const positiveAnswers = questions.filter((q) => q.answer === "yes").length;
    setResult(
      positiveAnswers >= 2
        ? `Consulta médica urgente recomendada con los MPIDs seleccionados (${selectedMPIDs.join(", ")})`
        : `Los MPIDs seleccionados (${selectedMPIDs.join(", ")}) no indican urgencia inmediata.`
    );
  };

  return (
    <div className="home-container">
      <div className="header">
        {step !== "select" && (
          <button className="back" onClick={() => setStep("select")}>
            Volver
          </button>
        )}
        <a href="http://localhost:3001/profile" className="profile-button">
          <img src={profileImage} alt="Perfil" />
        </a>
      </div>

      {step === "select" && (
        <div className="mpid-selector">
          <h2>Seleccione sus MPIDs</h2>
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
            <button onClick={handleSelectMPID}>Añadir</button>
          </div>
          {selectedMPIDs.length > 0 && (
            <div className="selected-mpids">
              <h3>MPIDs seleccionados:</h3>
              {selectedMPIDs.map((mpid) => (
                <div key={mpid} className="mpid-item">
                  <span>{mpid}</span>
                  <button onClick={() => handleDeselectMPID(mpid)}>x</button>
                </div>
              ))}
              <button onClick={() => setStep("questionnaire")}>Continuar</button>
            </div>
          )}
        </div>
      )}

      {step === "questionnaire" && (
        <div className="questionnaire">
          <h2>¿Cómo te encuentras hoy?</h2>
          <div className="question-grid">
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <p>{q.question}</p>
                <div className="options">
                  <label>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value="yes"
                      checked={q.answer === "yes"}
                      onChange={() => handleAnswerChange(q.id, "yes")}
                    />
                    Sí
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value="no"
                      checked={q.answer === "no"}
                      onChange={() => handleAnswerChange(q.id, "no")}
                    />
                    No
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button onClick={sendAnswersToBackend} className="send">Enviar</button>
        </div>
      )}

      {step === "result" && (
        <div className="result-section">
          <div className="answer-group">
            <h4>Respuestas Sí</h4>
            <div className="answer-items-inline">
              {questions
                .filter((q) => q.answer === "yes")
                .map((q) => (
                  <div key={q.id} className="answer-item">
                    {q.question}
                  </div>
                ))}
            </div>
          </div>

          <div className="answer-group">
            <h4>Respuestas No</h4>
            <div className="answer-items-inline">
              {questions
                .filter((q) => q.answer === "no")
                .map((q) => (
                  <div key={q.id} className="answer-item">
                    {q.question}
                  </div>
                ))}
            </div>
          </div>

          <div className="mpid-group">
            <h4>MPIDs seleccionados:</h4>
            <div className="mpid-list">
              {selectedMPIDs.map((mpid, index) => (
                <div key={index} className="mpid-item">{mpid}</div>
              ))}
            </div>
          </div>

          <div className="final-result">{result}</div>
        </div>
      )}
    </div>
  );
};

export default Home;

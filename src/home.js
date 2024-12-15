import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './home.css';
import axios from 'axios';
import { UNSAFE_DataRouterStateContext } from 'react-router-dom';

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
        date: new Date().toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:3000/add-symptoms', dataToSend);
        console.log('Data sent to backend:', response.data);
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
      q.id === id ? { ...q, answer } : q
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
    setStep("result");
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
            <button onClick={() => {
              if (currentMPID && !selectedMPIDs.includes(currentMPID)) {
                const updatedMPIDs = [...selectedMPIDs, currentMPID];
                setSelectedMPIDs(updatedMPIDs);
                Cookies.set("mpids", JSON.stringify(updatedMPIDs), { expires: 365 });
              }
              setCurrentMPID("");
            }}>
              Añadir
            </button>
          </div>
          {selectedMPIDs.length > 0 && (
            <div className="selected-mpids">
              <h3>MPIDs seleccionados:</h3>
              {selectedMPIDs.map((mpid) => (
                <div key={mpid} className="mpid-item">
                  <span>{mpid}</span>
                  <button onClick={() => {
                    const updatedMPIDs = selectedMPIDs.filter((m) => m !== mpid);
                    setSelectedMPIDs(updatedMPIDs);
                    Cookies.set("mpids", JSON.stringify(updatedMPIDs), { expires: 365 });
                  }}>x</button>
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
                      onChange={() => setQuestions(
                        questions.map((ques) =>
                          ques.id === q.id ? { ...ques, answer: "yes" } : ques
                        )
                      )}
                    />
                    Sí
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value="no"
                      checked={q.answer === "no"}
                      onChange={() => setQuestions(
                        questions.map((ques) =>
                          ques.id === q.id ? { ...ques, answer: "no" } : ques
                        )
                      )}
                    />
                    No
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button onClick={sendAnswersToBackend} className="send">Enviar</button>
          {result && <p className="result">{result}</p>}
        </div>
      )}


    </div>
  );
};

export default Home;

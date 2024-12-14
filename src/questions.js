import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Questions() {
  const [userName, setUserName] = useState(""); // Stores the user's name
  const [userMpids, setUserMpids] = useState([]); // Stores the user's current MPIDs
  const [dropdowns, setDropdowns] = useState([{ id: 1, value: "" }]);
  const [selectedOptions, setSelectedOptions] = useState([]); // Stores newly selected MPIDs
  const [questions, setQuestions] = useState([
    { id: 1, text: "Do you experience shortness of breath?", answer: null },
    { id: 2, text: "Do you have a persistent cough?", answer: null },
    { id: 3, text: "Do you produce excessive mucus?", answer: null },
  ]);

  const variableList = [
    "Asthma",
    "Chronic Bronchitis",
    "Emphysema",
    "Pulmonary Fibrosis",
    "COPD",
    "Lung Cancer",
    "Tuberculosis",
  ];

  // Fetch user information and MPIDs from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("userToken"); // Retrieve the user's cookie
      if (!token) {
        alert("No user session found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data.");

        const data = await response.json();
        setUserName(data.name); // Set the user's name
        setUserMpids(data.mpids); // Set the user's MPIDs from the database
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDropdownChange = (id, value) => {
    const updatedDropdowns = dropdowns.map((dropdown) =>
      dropdown.id === id ? { ...dropdown, value } : dropdown
    );
    setDropdowns(updatedDropdowns);

    const updatedOptions = updatedDropdowns.map((dropdown) => dropdown.value);
    setSelectedOptions(updatedOptions);
  };

  const addDropdown = () => {
    const newDropdown = { id: dropdowns.length + 1, value: "" };
    setDropdowns([...dropdowns, newDropdown]);
  };

  const handleAnswerChange = (id, answer) => {
    const updatedQuestions = questions.map((question) =>
      question.id === id ? { ...question, answer } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const token = Cookies.get("userToken"); // Retrieve the user's cookie
    if (!token) {
      alert("No user session found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/update-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mpids: [...userMpids, ...selectedOptions],
          questions: questions.map((q) => ({ id: q.id, answer: q.answer })),
        }),
      });

      if (!response.ok) throw new Error("Failed to send data.");

      alert("Data sent successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <h2>Welcome, {userName}</h2>

      <h2>Current MPIDs</h2>
      {/* Display current MPIDs */}
      <ul>
        {userMpids.map((mpid, index) => (
          <li key={index}>{mpid}</li>
        ))}
      </ul>

      <h2>Add a New MPID</h2>
      <div>
        {dropdowns.map((dropdown) => (
          <div key={dropdown.id} style={{ marginBottom: "10px" }}>
            <label htmlFor={`dropdown-${dropdown.id}`}>Add a Lung Disease:</label>
            <select
              id={`dropdown-${dropdown.id}`}
              value={dropdown.value}
              onChange={(e) => handleDropdownChange(dropdown.id, e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="" disabled>
                -- Select an option --
              </option>
              {variableList
                .filter(
                  (option) =>
                    ![...userMpids, ...selectedOptions].includes(option) ||
                    option === dropdown.value
                )
                .map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        ))}
        <button onClick={addDropdown} style={{ marginTop: "20px" }}>
          Add Another MPID
        </button>
      </div>

      <h2>How Are You Feeling Today?</h2>
      {/* Yes/No Questions */}
      {questions.map((question) => (
        <div key={question.id} style={{ marginBottom: "15px" }}>
          <p>{question.text}</p>
          <div>
            <label>
              <input
                type="radio"
                name={`question-${question.id}`}
                value="yes"
                checked={question.answer === "yes"}
                onChange={() => handleAnswerChange(question.id, "yes")}
              />
              Yes
            </label>
            <label style={{ marginLeft: "15px" }}>
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
        </div>
      ))}

      {/* Send Button */}
      <button
        onClick={handleSubmit}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Questions;

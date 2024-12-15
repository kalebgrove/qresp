import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import axios from 'axios'; // Import Axios

function Profile() {
  const [profileImage, setProfileImage] = useState('/images/default-profile.jpg');
  const [activeTab, setActiveTab] = useState('datos');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userDetails, setUserDetails] = useState(null); // New state to hold user data from backend
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dni, setDNI] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

   useEffect(() => {
      const fetchUserData = async () => {
        const userC = Cookies.get("user"); // Retrieve the user's cookie
        if (!userC) {
          alert("No user session found. Please log in.");
          return;
        }
        
  
        try {

          const user = JSON.parse(userC);

          console.log(user.email);

          const payload = { email: user.email };

          const response = await fetch("http://localhost:3000/get-usr-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
  
          if (!response.ok) throw new Error("Failed to fetch user data.");
  
          const data = await response.json();

          /*function formatDateToISO(date) {
            let dob = new Date(date); // Ensure the date is a Date object
          
            return dob.toISOString().split('T')[0];
          }*/
          
          //const formattedDob = formatDateToISO(data.dob);
          // console.log(data.age);

          setName(`${data.firstname} ${data.lastname}`);
          setAge(data.age);
          setDNI(data.dni);
          setSex(data.sex);
          setEmail(data.email);
          setNumber(data.number);

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);

  // Simulación de la contraseña almacenada
  const storedPassword = 'password123';

  const accountDetails = {
    "Nom i Cognom": name,
    DNI: dni,
    "Data de Naixement": age,
    Sexe: sex,
    "Correu Electrònic": email,
    "Telèfon": number,
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setProfileImage(newImage);
        localStorage.setItem('profileImage', newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefault = () => {
    const defaultImage = '/images/default-profile.jpg';
    setProfileImage(defaultImage);
    localStorage.setItem('profileImage', defaultImage);
  };

  const handleSavePassword = () => {
    setError('');
    setSuccess('');

    if (currentPassword !== storedPassword) {
      setError('La contraseña actual no es correcta.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Simula guardar la nueva contraseña
    alert('Contraseña cambiada con éxito.');
    setSuccess('Contraseña cambiada con éxito.');
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="profile-container">
      {/* Columna izquierda */}
      <div className="profile-left">
        <div className="profile-img-container">
          <img src={profileImage} alt="Foto de perfil" className="profile-img-large" />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button onClick={resetToDefault} className="reset-button">
          Restablecer Imagen
        </button>
        <div className="profile-menu">
          <button
            className={`menu-button ${activeTab === 'datos' ? 'active' : ''}`}
            onClick={() => setActiveTab('datos')}
          >
            Datos Personales
          </button>
          <button
            className={`menu-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Modificar Contraseña
          </button>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="profile-right">
        {activeTab === 'datos' && (
          <div className="account-info">
            <h3>Información de la cuenta</h3>
            {userDetails ? (
              Object.entries(userDetails).map(([label, value]) => (
                <div className="info-item" key={label}>
                  <span className="info-label">{label}:</span>
                  <span className="info-value">{value}</span>
                </div>
              ))
            ) : (
              Object.entries(accountDetails).map(([label, value]) => (
                <div className="info-item" key={label}>
                  <span className="info-label">{label}:</span>
                  <span className="info-value">{value}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div className="account-info">
            <h3>Cambiar Contraseña</h3>
            <div className="info-item">
              <input
                type="password"
                placeholder="Contraseña Actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="password-input"
              />
            </div>
            <div className="info-item">
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
            </div>
            <div className="info-item">
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
              />
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            <button type="button" onClick={handleSavePassword} className="save-button">
              Guardar Contraseña
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

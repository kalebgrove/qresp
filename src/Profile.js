import React, { useState, useEffect } from 'react';
import './Profile.css';
import Cookies from 'js-cookie';
import { QRCodeCanvas } from 'qrcode.react'; // Usa QRCodeCanvas

function Profile() {
  const [profileImage, setProfileImage] = useState('/images/default-profile.jpg');
  const [activeTab, setActiveTab] = useState('datos');
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dni, setDNI] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const userC = Cookies.get("user");
      if (!userC) {
        alert("No user session found. Please log in.");
        return;
      }

      try {
        const user = JSON.parse(userC);
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

  const toggleQRPopup = () => {
    setShowQRPopup(!showQRPopup);
  };

  return (
    <>
      {/* Botón fuera del contenedor principal */}
      <button className="back-home" onClick={() => window.location.href = 'http://localhost:3001/home'}>
        Volver
      </button>

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
              {/* Datos del usuario */}
              <>
                <div className="info-item">
                  <span className="info-label">Nombre y Apellido:</span>
                  <span className="info-value">{name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">DNI:</span>
                  <span className="info-value">{dni}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Edad:</span>
                  <span className="info-value">{age}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sexo:</span>
                  <span className="info-value">{sex}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Correo Electrónico:</span>
                  <span className="info-value">{email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{number}</span>
                </div>
              </>
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
              <button type="button" className="save-button">
                Guardar Contraseña
              </button>
            </div>
          )}
        </div>

        {/* Botón flotante */}
        <button className="qr-button" onClick={toggleQRPopup}>
          QR
        </button>

        {/* Popup con el QR */}
        {showQRPopup && (
          <div className="qr-popup">
            <div className="qr-popup-content">
              <button className="close-popup" onClick={toggleQRPopup}>
                ×
              </button>
              <QRCodeCanvas value="http://localhost:3000/resultados" size={200} />
              <p>Escanee el código QR para ver los resultados.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;

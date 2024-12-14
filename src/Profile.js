import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
  const [profileImage, setProfileImage] = useState('/images/default-profile.jpg');
  const [activeTab, setActiveTab] = useState('datos');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simulación de la contraseña almacenada
  const storedPassword = 'password123';

  const accountDetails = {
    "Nombre y Apellido": 'Juan Pérez',
    DNI: '12345678X',
    "Fecha de Nacimiento": '12/03/1990',
    Sexo: 'Masculino',
    "Correo Electrónico": 'juan.perez@example.com',
    "Número de Teléfono": '+34 612 345 678',
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
            {Object.entries(accountDetails).map(([label, value]) => (
              <div className="info-item" key={label}>
                <span className="info-label">{label}:</span>
                <span className="info-value">{value}</span>
              </div>
            ))}
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

export default Profile
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './Resultados.css';

function Resultados() {
  const [diagnostico, setDiagnostico] = useState('');
  const [gravedad, setGravedad] = useState('');
  const [mpids, setMpids] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        // Obtener MPIDs desde las cookies
        const mpidsCookie = Cookies.get('mpids');
        if (!mpidsCookie) {
          setError('No hay MPIDs disponibles. Complete el cuestionario primero.');
          setLoading(false);
          return;
        }

        const mpidsArray = JSON.parse(mpidsCookie);
        setMpids(mpidsArray);

        // Enviar solicitud al backend para obtener respuestas
        console.log('Enviando MPIDs al backend:', mpidsArray);

        const response = await fetch('http://localhost:3000/get-respuestas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mpids: mpidsArray }),
        });

        if (!response.ok) {
          console.error('Error en la respuesta del backend:', response.status, response.statusText);
          throw new Error('Error al obtener las respuestas del backend.');
        }

        const respuestas = await response.json();
        console.log('Respuestas obtenidas del backend:', respuestas);

        // Calcular diagnóstico basado en las respuestas
        const respuestasPositivas = respuestas.filter((resp) => resp.answer === 'yes').length;

        if (respuestasPositivas >= 3) {
          setDiagnostico('Se detectaron síntomas graves.');
          setGravedad('Urgente: Llame a una ambulancia o vaya al médico inmediatamente.');
        } else if (respuestasPositivas === 2) {
          setDiagnostico('Se detectaron algunos síntomas.');
          setGravedad('Recomendación: Visite al médico hoy.');
        } else {
          setDiagnostico('No se detectaron síntomas preocupantes.');
          setGravedad('Puede visitar al médico en los próximos días.');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error en fetchRespuestas:', err);
        setError('Ocurrió un error al obtener las respuestas.');
        setLoading(false);
      }
    };

    fetchRespuestas();
  }, []);

  if (loading) {
    return (
      <div className="resultados-container">
        <h1>Cargando resultados...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resultados-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="resultados-container">
      <h1>Resultados del Cuestionario</h1>
      <div className="resultado-diagnostico">
        <h2>Diagnóstico:</h2>
        <p>{diagnostico}</p>
      </div>
      <div className="resultado-gravedad">
        <h2>Nivel de Gravedad:</h2>
        <p>{gravedad}</p>
      </div>
      <div className="resultado-mpids">
        <h3>MPIDs Asociados:</h3>
        <ul>
          {mpids.map((mpid, index) => (
            <li key={index}>{mpid}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Resultados;

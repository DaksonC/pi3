import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TemperatureHumidityDisplay: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);

  useEffect(() => {
    const fetchTemperatureAndHumidity = async () => {
      try {
        const response = await axios.get('https://api-pi3-l1l5jywq4-daksonc.vercel.app/dados'); 
        const { temperatura, umidade } = response.data;
        setTemperature(Number(temperatura.toFixed(2)));
        setHumidity(Number(umidade.toFixed(2)));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    const intervalId = setInterval(fetchTemperatureAndHumidity, 5000); // Busca os dados a cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Dados de Temperatura e Umidade</h2>
      {temperature !== null && humidity !== null ? (
        <div>
          <p>Temperatura: <span>{temperature} °C 🌡️</span></p>
          <p>Umidade: <span>{humidity} % 💦</span></p>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default TemperatureHumidityDisplay;

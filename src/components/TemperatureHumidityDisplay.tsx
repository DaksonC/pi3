import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TemperatureHumidityData {
  temperatura: number;
  umidade: number;
  data: Date;
}

const TemperatureHumidityDisplay: React.FC = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [history, setHistory] = useState<TemperatureHumidityData[]>([]);

  useEffect(() => {
    const fetchTemperatureAndHumidity = async () => {
      try {
        const [currentResponse, historyResponse] = await Promise.all([
          axios.get('https://api-pi3-5tlxb6hns-daksonc.vercel.app/dados/atual'),
          axios.get('https://api-pi3-5tlxb6hns-daksonc.vercel.app/dados/historico')
        ]);

        const { temperatura, umidade } = currentResponse.data;
        const currentData = {
          temperatura: Number(temperatura.toFixed(2)),
          umidade: Number(umidade.toFixed(2))
        };

        const historyData: TemperatureHumidityData[] = historyResponse.data.slice(0, 7);
        setTemperature(currentData.temperatura);
        setHumidity(currentData.umidade);
        setHistory(historyData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    const intervalId = setInterval(fetchTemperatureAndHumidity, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Dados de Temperatura e Umidade</h2>
      {temperature !== null && humidity !== null ? (
        <div>
          <p>Temperatura: <span>{temperature} °C 🌡️</span></p>
          <p>Umidade: <span>{humidity} % 💦</span></p>
          <hr />
          <h3>Histórico</h3>
            <ul>
              {history.map((data, index) => (
                <li key={index}>
                  <div id="historico">
                    <span id="data">
                      {new Date(data.data).toLocaleString()}
                    </span>
                    <span id="temp">
                      {data.temperatura.toFixed(2)} °C ️🌡️
                      <br />
                    </span>
                    <span id="umid">
                      {data.umidade.toFixed(2)} % 💦
                    </span>
                </div>
                </li>
              ))}
            </ul>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default TemperatureHumidityDisplay;


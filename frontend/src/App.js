import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config.js';

const isDeployed = true;

const App = () => {
  const [status, setStatus] = useState('Chargement...'); // État initial

  const turnOnPC = async () => {
    try {
      // Envoyer une requête pour allumer le PC
      await axios.post(`${config.backend_ip}${!isDeployed ? config.backend_port : ""}/turn-on-pc`);
    } catch (error) {
      console.error('Erreur lors de l\'allumage du PC :', error);
    }
  };

  const fetchPCStatus = async () => {
    try {
      // Récupérer le statut du PC
      console.log('on me demande de récupérer le statut du PC ' + `${config.backend_ip}${!isDeployed ? config.backend_port : ""}/pc-status`);
      const response = await axios.post(`${config.backend_ip}${!isDeployed ? config.backend_port : ""}/pc-status`);
      console.log(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error('Erreur lors de la récupération du statut du PC :', error);
    }
  };

  useEffect(() => {
    // Récupérer le statut initial lors du chargement de la page
    fetchPCStatus();
  }, []);

  return (
    <div>
      <h1>Contrôle PC</h1>
      <p>Statut du PC : {status}</p>
      <button onClick={turnOnPC}>Allumer le PC</button>
      <a href="parsec://">Ouvrir Parsec</a>
    </div>
  );
};

export default App;
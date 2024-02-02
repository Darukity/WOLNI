const express = require('express');
const app = express();
const wol = require('wol');
const ping = require('ping');
const cors = require('cors');
const config = require('./config.js');

const PORT = config.backend_port;
const PC_MAC_ADDRESS = config.wake_lan_mac; // Remplacez par l'adresse MAC de votre PC
const PC_BROADCAST_ADDRESS = config.ip_brodcast; // Remplacez par l'adresse de diffusion de votre PC
const PC_IP_ADDRESS = config.pc_ip; // Remplacez par l'adresse IP de votre PC

// Ajoutez cette ligne pour initialiser le statut
let status = 'Éteint';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ajoutez cette fonction pour mettre à jour le statut
const setStatus = (newStatus) => {
  status = newStatus;
};

app.post('/turn-on-pc', async (req, res) => {
  console.log('on me demande d\'allumer le PC');
  try {
    // Envoyer le signal Wake-on-LAN
    wol.wake(PC_MAC_ADDRESS, { address: PC_BROADCAST_ADDRESS });

    // Mettre à jour le statut
    setStatus('En cours d\'allumage...');

    // Attendre un certain temps pour que le PC démarre
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Vérifier le statut après l'attente
    const isReachable = await checkPCStatus();
    setStatus(isReachable ? 'Allumé' : 'Éteint');
  } catch (error) {
    console.error('Erreur lors de l\'allumage du PC :', error);
    setStatus('Erreur d\'allumage');
  }

  res.sendStatus(200);
});

// Fonction pour vérifier le statut du PC avec un ping
const checkPCStatus = async () => {
  try {
    const result = await ping.promise.probe(PC_IP_ADDRESS);
    return result.alive;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut du PC :', error);
    return false;
  }
};

app.post('/pc-status', async (req, res) => {
  console.log('on me demande le statut', Date.now('HH:mm:ss'));
  const isReachable = await checkPCStatus();
  setStatus(isReachable ? 'Allumé' : 'Éteint');
  res.json({ status });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

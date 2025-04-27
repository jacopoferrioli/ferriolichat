// Configurazione Appwrite
const appwrite = new Appwrite();

appwrite
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Sostituisci con il tuo endpoint
    .setProject('680c9ede00072e23888c '); // Sostituisci con il tuo Project ID

// Esporta l'istanza di Appwrite per usarla in altri file
export { appwrite };

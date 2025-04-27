import { appwrite } from './appwrite.js';

// Funzioni specifiche per l'admin possono essere aggiunte qui
// Per esempio, gestione annunci, utenti, ecc.

// Esempio: funzione per salvare un annuncio
async function saveAnnouncement(title, message) {
    try {
        // Sostituisci con la tua configurazione Appwrite
        const announcement = await appwrite.database.createDocument(
            '680cc6f90026948c5756D', // ID della tua collection per gli annunci
            'unique()', // ID documento
            { title, message, date: new Date().toISOString() }
        );
        
        return announcement;
    } catch (error) {
        console.error('Error saving announcement:', error);
        return null;
    }
}

// Esporta le funzioni per usarle in altri file
export { saveAnnouncement };

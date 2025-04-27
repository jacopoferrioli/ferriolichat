import { appwrite } from './appwrite.js';

// Funzioni aggiuntive per la dashboard possono essere aggiunte qui
// Per esempio, gestione documenti, moduli, ecc.

// Esempio: funzione per caricare documenti da Appwrite
async function loadDocuments() {
    try {
        // Sostituisci con la tua configurazione Appwrite
        const documents = await appwrite.database.listDocuments(
            '680cc6e8000338fc38fe', // ID della tua collection
            [], // Filtri
            100 // Limite
        );
        
        return documents;
    } catch (error) {
        console.error('Error loading documents:', error);
        return [];
    }
}

// Esporta le funzioni per usarle in altri file
export { loadDocuments };

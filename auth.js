import { appwrite } from './appwrite.js';

// Elementi DOM
const navbar = document.getElementById('navbar');
const mainContent = document.getElementById('main-content');
const pageContent = document.getElementById('page-content');

// Variabili globali
let currentUser = null;

// Funzione per verificare lo stato di autenticazione
async function checkAuthState() {
    try {
        const user = await appwrite.account.get();
        currentUser = user;
        renderNavbar(user);
        renderDashboard();
    } catch (error) {
        renderLoginPage();
    }
}

// Funzione per renderizzare la navbar
function renderNavbar(user) {
    navbar.innerHTML = `
        <div class="nav-brand">
            <button class="nav-menu-btn" id="sidebar-toggle">
                <i class="fas fa-bars"></i>
            </button>
            <span>Ferrioli Gestionale</span>
        </div>
        <div class="nav-user" id="user-dropdown-toggle">
            <div class="nav-user-info">
                <span class="nav-user-name">${user.name || 'Utente'}</span>
                <span class="nav-user-email">${user.email}</span>
            </div>
            <i class="fas fa-chevron-down"></i>
            <div class="user-dropdown" id="user-dropdown">
                <a href="#" id="support-link"><i class="fas fa-question-circle"></i> Supporto</a>
                <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
        </div>
    `;
    
    // Aggiungi sidebar
    document.body.insertAdjacentHTML('beforeend', `
        <div class="sidebar" id="sidebar">
            <ul class="sidebar-menu">
                <li><a href="#" data-page="dashboard"><i class="fas fa-home"></i> Dashboard</a></li>
                <li><a href="#" data-page="documents"><i class="fas fa-file-alt"></i> Documenti</a></li>
                ${isAdmin(user.email) ? '<li><a href="#" data-page="admin"><i class="fas fa-cog"></i> Admin</a></li>' : ''}
            </ul>
        </div>
    `);
    
    // Aggiungi gestori eventi
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('user-dropdown-toggle').addEventListener('click', toggleUserDropdown);
    document.getElementById('logout-link').addEventListener('click', logout);
    document.getElementById('support-link').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:supporto@ferrioli.eu?subject=SUPPORTO - LOGIN PAGE';
    });
    
    // Aggiungi gestori eventi per il menu laterale
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
        });
    });
}

// Funzione per verificare se l'utente è admin
function isAdmin(email) {
    const adminEmails = [
        'jacopo@ferrioli.eu',
        'postmaster@ferrioli.eu',
        'amministrazione.generale@cas.ferrioli.eu'
    ];
    return adminEmails.includes(email);
}

// Funzione per mostrare/nascondere la sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// Funzione per mostrare/nascondere il dropdown utente
function toggleUserDropdown() {
    document.getElementById('user-dropdown').classList.toggle('show');
}

// Funzione per il logout
async function logout() {
    try {
        await appwrite.account.deleteSession('current');
        currentUser = null;
        renderLoginPage();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Si è verificato un errore durante il logout');
    }
}

// Funzione per renderizzare la pagina di login
function renderLoginPage() {
    navbar.innerHTML = '<div class="nav-brand">Ferrioli Gestionale</div>';
    document.getElementById('sidebar')?.remove();
    
    pageContent.innerHTML = '';
    mainContent.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <img src="images/logo.png" alt="Ferrioli Logo">
                <h2>Accedi al gestionale</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required placeholder="inserisci la tua email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required placeholder="inserisci la tua password">
                    </div>
                    <button type="submit" class="btn btn-block">Accedi</button>
                </form>
                <div class="login-links">
                    <a href="#" id="forgot-password">Recupera password</a> | 
                    <a href="mailto:supporto@ferrioli.eu?subject=SUPPORTO - LOGIN PAGE">Supporto</a>
                </div>
            </div>
        </div>
    `;
    
    // Aggiungi gestori eventi
    document.getElementById('login-form').addEventListener('submit', login);
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Una email per il recupero password è stata inviata al tuo indirizzo email.');
    });
}

// Funzione per il login
async function login(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await appwrite.account.createEmailSession(email, password);
        await checkAuthState();
    } catch (error) {
        console.error('Login error:', error);
        alert('Credenziali non valide. Riprova o contatta il supporto.');
    }
}

// Funzione per caricare una pagina specifica
function loadPage(page) {
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'documents':
            renderDocumentsPage();
            break;
        case 'admin':
            renderAdminPage();
            break;
        default:
            renderDashboard();
    }
    
    // Chiudi la sidebar su mobile
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

// Funzione per renderizzare la dashboard
function renderDashboard() {
    pageContent.innerHTML = `
        <h1>Dashboard</h1>
        <p>Benvenuto nel gestionale Ferrioli</p>
        <div class="dashboard-grid" id="dashboard-buttons"></div>
    `;
    
    renderDashboardButtons();
}

// Funzione per renderizzare i pulsanti della dashboard in base all'email
function renderDashboardButtons() {
    const buttonsContainer = document.getElementById('dashboard-buttons');
    const email = currentUser.email;
    
    let buttonsHTML = '';
    
    // Pulsanti per tutti gli utenti
    buttonsHTML += `
        <div class="dashboard-card">
            <h3>Notion</h3>
            <p>Accedi alla tua area Notion</p>
            <a href="https://www.notion.so/login" target="_blank" class="btn">Accedi a Notion</a>
        </div>
        <div class="dashboard-card">
            <h3>BaseBear</h3>
            <p>Accedi alla tua area BaseBear</p>
            <a href="https://www.basebear.com/login" target="_blank" class="btn">Accedi a BaseBear</a>
        </div>
        <div class="dashboard-card">
            <h3>Billetto</h3>
            <p>Accedi all'organizzatore Billetto</p>
            <a href="https://www.billetto.com/login" target="_blank" class="btn">Accedi a Billetto</a>
        </div>
    `;
    
    // Pulsanti per @ferrioli.eu
    if (email.endsWith('@ferrioli.eu') || isAdmin(email)) {
        buttonsHTML += `
            <div class="dashboard-card">
                <h3>Webmail Aruba</h3>
                <p>Accedi alla tua webmail Aruba</p>
                <a href="https://webmail.aruba.it" target="_blank" class="btn">Accedi ad Aruba</a>
            </div>
        `;
    }
    
    // Pulsanti per @*.ferrioli.eu
    if (email.match(/@.+\.ferrioli\.eu$/) || isAdmin(email)) {
        buttonsHTML += `
            <div class="dashboard-card">
                <h3>Webmail Zoho</h3>
                <p>Accedi alla tua webmail Zoho</p>
                <a href="https://mail.zoho.com" target="_blank" class="btn">Accedi a Zoho</a>
            </div>
        `;
    }
    
    // Pulsanti solo per admin
    if (isAdmin(email)) {
        buttonsHTML += `
            <div class="dashboard-card">
                <h3>Pannello Aruba</h3>
                <p>Pannello di controllo Aruba</p>
                <a href="https://admin.aruba.it/PannelloAdmin/Login.aspx" target="_blank" class="btn">Accedi al pannello</a>
            </div>
            <div class="dashboard-card">
                <h3>Pannello Zoho</h3>
                <p>Pannello di controllo Zoho</p>
                <a href="https://www.zoho.com/mail/control-panel.html" target="_blank" class="btn">Accedi al pannello</a>
            </div>
        `;
    }
    
    buttonsContainer.innerHTML = buttonsHTML;
}

// Funzione per renderizzare la pagina documenti
function renderDocumentsPage() {
    pageContent.innerHTML = `
        <h1>Documenti</h1>
        <p>Gestisci i tuoi documenti</p>
        <div id="documents-list">
            <p>Caricamento documenti in corso...</p>
        </div>
    `;
    
    // Qui dovresti implementare la logica per recuperare i documenti da Appwrite
    setTimeout(() => {
        document.getElementById('documents-list

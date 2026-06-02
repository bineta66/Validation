const icones = {
    'Veille Tech': 'ti-device-laptop',
    'Gaming':      'ti-device-gamepad-2',
    'Sport':       'ti-run',
    'Musique':     'ti-music',
    'Lecture':     'ti-book',
};

document.getElementById('carteProfil').innerHTML = `
    <div class="etat-vide">
        <i class="ti ti-id-badge"></i>
        <p>Remplis le formulaire et ta carte<br>de profil apparaîtra ici ✨</p>
    </div>
`;

// Pour input / select / textarea
function afficherErreur(champ, message) {
    champ.classList.remove('bordure-succes');
    champ.classList.add('bordure-erreur');
    const petit = champ.closest('.groupe')?.querySelector('.message-erreur');
    if (petit) petit.textContent = message;
}
function effacerErreur(champ) {
    champ.classList.remove('bordure-erreur');
    champ.classList.add('bordure-succes');
    const petit = champ.closest('.groupe')?.querySelector('.message-erreur');
    if (petit) petit.textContent = '';
}

// Pour radio / checkbox (pas de champ unique ciblé)
function afficherErreurGroupe(groupe, message) {
    const petit = groupe.querySelector('.message-erreur');
    if (petit) { petit.textContent = message; petit.style.color = '#fca5a5'; }
}
function effacerErreurGroupe(groupe) {
    const petit = groupe.querySelector('.message-erreur');
    if (petit) petit.textContent = '';
}

function validerNom() {
    const c = document.getElementById('nom');
    const v = c.value.trim();

    if (v === '') {
        c.classList.remove('bordure-erreur', 'bordure-succes');
        const petit = c.closest('.groupe')?.querySelector('.message-erreur');
        if (petit) petit.textContent = '';
        return false;
    }

    if (v.length < 3) {
        afficherErreur(c, 'Minimum 3 caractères.');
        return false;
    }

    effacerErreur(c);
    return true;
}
function validerPrenom() {
    const c = document.getElementById('prenom');
    const v = c.value.trim();

    if (v === '') {
        c.classList.remove('bordure-erreur', 'bordure-succes');
        const petit = c.closest('.groupe')?.querySelector('.message-erreur');
        if (petit) petit.textContent = '';
        return false;
    }

    if (v.length < 3) {
        afficherErreur(c, 'Minimum 3 caractères.');
        return false;
    }

    effacerErreur(c);
    return true;
}
function validerEmail() {
    const c = document.getElementById('email');
    const v = c.value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (v === '') {
        c.classList.remove('bordure-erreur', 'bordure-succes');
        const petit = c.closest('.groupe')?.querySelector('.message-erreur');
        if (petit) petit.textContent = '';
        return false;
    }

    if (!regex.test(v)) {
        afficherErreur(c, 'Format invalide — ex : nom@domaine.fr');
        return false;
    }

    effacerErreur(c);
    return true;
}

function validerDomaine() {
    const c = document.getElementById('domaine');
    if (!c.value) { afficherErreur(c, 'Choisis un domaine.'); return false; }
    effacerErreur(c); return true;
}

function validerRythme() {
    const groupe = document.querySelector('input[name="rythme"]').closest('.groupe');
    const coche  = document.querySelector('input[name="rythme"]:checked');
    if (!coche) { afficherErreurGroupe(groupe, 'Choisis ton rythme de travail.'); return false; }
    effacerErreurGroupe(groupe); return true;
}

function validerInterets() {
    const groupe = document.querySelector('.groupe-cases').closest('.groupe');
    const coches = document.querySelectorAll('.groupe-cases input:checked');
    if (coches.length < 2) {
        afficherErreurGroupe(groupe, "Sélectionne au moins 2 centres d'intérêt.");
        return false;
    }
    effacerErreurGroupe(groupe); return true;
}

function validerBio() {
    const c   = document.getElementById('bio');
    const val = c.value.trim();
    if (val.length === 0) {
        // facultatif si vide — on retire juste les classes
        c.classList.remove('bordure-erreur', 'bordure-succes');
        const petit = c.closest('.groupe')?.querySelector('.message-erreur');
        if (petit) petit.textContent = '';
        return true;
    }
    if (val.length < 25) {
        afficherErreur(c, `Minimum 25 caractères — encore ${25 - val.length} à écrire.`);
        return false;
    }
    effacerErreur(c); return true;
}

/* COMPTEUR CARACTÈRES + validation bio*/
const bio      = document.getElementById('bio');
const restants = document.getElementById('restants');

bio.addEventListener('input', () => {
    restants.textContent = 255 - bio.value.length;
    validerBio();
});
bio.addEventListener('blur', validerBio);

/* 
   ÉCOUTEURS TEMPS RÉEL
   blur  → valide dès que l'utilisateur quitte le champ
   input → corrige en direct une fois que l'erreur est apparue
 */

/*
   ÉCOUTEURS TEMPS RÉEL
   Validation immédiate pendant la saisie
 */

// Nom 
const champNom = document.getElementById('nom');

champNom.addEventListener('input', validerNom);
champNom.addEventListener('blur', validerNom);

//  Prénom 
const champPrenom = document.getElementById('prenom');

champPrenom.addEventListener('input', validerPrenom);
champPrenom.addEventListener('blur', validerPrenom);

// Email 
const champEmail = document.getElementById('email');

champEmail.addEventListener('input', validerEmail);
champEmail.addEventListener('blur', validerEmail);

// Domaine 
const champDomaine = document.getElementById('domaine');

champDomaine.addEventListener('change', validerDomaine);
champDomaine.addEventListener('blur', validerDomaine);

// Radios rythme 
document.querySelectorAll('input[name="rythme"]').forEach(radio => {
    radio.addEventListener('change', validerRythme);
});

// ─Checkboxes intérêts 
document.querySelectorAll('.groupe-cases input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', validerInterets);
});


document.getElementById('formulaire').addEventListener('submit', (e) => {
    e.preventDefault();

    // Forcer la validation de tous les champs pour révéler
    // les erreurs des champs que l'utilisateur n'a pas touchés
    const ok = [
        validerNom(),
        validerPrenom(),
        validerEmail(),
        validerDomaine(),
        validerRythme(),
        validerInterets(),
        validerBio(),
    ].every(Boolean);

    if (!ok) return;

    //  Génération carte profil 
    const nom     = document.getElementById('nom').value.trim();
    const prenom  = document.getElementById('prenom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const domaine = document.getElementById('domaine').value;
    const rythme  = document.querySelector('input[name="rythme"]:checked').value;
    const interets = [...document.querySelectorAll('.groupe-cases input:checked')];

    const initiales   = (prenom[0] + nom[0]).toUpperCase();
    const rythmeLabel = rythme === 'leve-tot'
        ? '<i class="ti ti-sun"></i> Early Bird'
        : '<i class="ti ti-moon"></i> Night Owl';

    const etiquettesHTML = interets.map(i => `
        <span class="etiquette">
            <i class="ti ${icones[i.value] || 'ti-star'}"></i> ${i.value}
        </span>`).join('');

    const bioVal  = bio.value.trim();
    const bioHTML = bioVal
        ? `<div class="profil-ligne" style="flex-direction:column;gap:6px;">
               <strong><i class="ti ti-pencil"></i> Présentation</strong>
               <p class="texte-bio">${bioVal}</p>
           </div>`
        : '';

    document.getElementById('carteProfil').innerHTML = `
        <div class="profil">
            <div class="profil-entete">
                <div class="initiales">${initiales}</div>
                <div class="profil-entete-texte">
                    <h2>${prenom} ${nom}</h2>
                    <span><i class="ti ti-briefcase"></i> ${domaine}</span>
                </div>
            </div>
            <div class="profil-ligne">
                <strong><i class="ti ti-mail"></i> E-mail</strong>
                <span>${email}</span>
            </div>
            <div class="profil-ligne">
                <strong><i class="ti ti-clock"></i> Rythme</strong>
                <span>${rythmeLabel}</span>
            </div>
            <div class="profil-ligne">
                <strong><i class="ti ti-heart"></i> Intérêts</strong>
                <div class="etiquettes">${etiquettesHTML}</div>
            </div>
            ${bioHTML}
        </div>
    `;

    document.getElementById('carteProfil')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
});
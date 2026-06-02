/* COMPTEUR DE CARACTÈRES*/
const bio     = document.getElementById('bio');
const restants = document.getElementById('restants');

bio.addEventListener('input', () => {
    restants.textContent = 255 - bio.value.length;
});


const icones = {
    'Veille Tech': 'ti-device-laptop',
    'Gaming':      'ti-device-gamepad-2',
    'Sport':       'ti-run',
    'Musique':     'ti-music',
    'Lecture':     'ti-book',
};

/*
    VALIDATION
*/
function afficherErreur(groupe, message) {
    const champ = groupe.querySelector('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    const petit = groupe.querySelector('.message-erreur');
    if (champ) {
        champ.classList.remove('bordure-succes');
        champ.classList.add('bordure-erreur');
    }
    if (petit) petit.textContent = message;
}

function effacerErreur(groupe) {
    const champs = groupe.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    const petit  = groupe.querySelector('.message-erreur');
    champs.forEach(c => {
        c.classList.remove('bordure-erreur');
        c.classList.add('bordure-succes');
    });
    if (petit) petit.textContent = '';
}

function reinitialiser(groupe) {
    const champs = groupe.querySelectorAll('input, select, textarea');
    const petit  = groupe.querySelector('.message-erreur');
    champs.forEach(c => c.classList.remove('bordure-erreur', 'bordure-succes'));
    if (petit) petit.textContent = '';
}

/* SOUMISSION DU FORMULAIRE */
document.getElementById('formulaire').addEventListener('submit', (e) => {
    e.preventDefault();

    // Réinitialiser tous les groupes
    document.querySelectorAll('.groupe').forEach(reinitialiser);

    let valide = true;

    // Récupération des champs
    const nom     = document.getElementById('nom');
    const prenom  = document.getElementById('prenom');
    const email   = document.getElementById('email');
    const domaine = document.getElementById('domaine');
    const rythme  = document.querySelector('input[name="rythme"]:checked');
    const interets = [...document.querySelectorAll('.groupe-cases input:checked')];

    // ── Validation Nom 
    const groupeNom = nom.closest('.groupe');
    if (!nom.value.trim()) {
        afficherErreur(groupeNom, 'Le nom est obligatoire.');
        valide = false;
    } else {
        effacerErreur(groupeNom);
    }

    // Validation Prénom 
    const groupePrenom = prenom.closest('.groupe');
    if (!prenom.value.trim()) {
        afficherErreur(groupePrenom, 'Le prénom est obligatoire.');
        valide = false;
    } else {
        effacerErreur(groupePrenom);
    }

    //  Validation Email 
    const groupeEmail = email.closest('.groupe');
    const regexEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        afficherErreur(groupeEmail, 'L\'adresse e-mail est obligatoire.');
        valide = false;
    } else if (!regexEmail.test(email.value)) {
        afficherErreur(groupeEmail, 'Format d\'e-mail invalide (ex : nom@domaine.fr).');
        valide = false;
    } else {
        effacerErreur(groupeEmail);
    }

    //  Validation Domaine 
    const groupeDomaine = domaine.closest('.groupe');
    if (!domaine.value) {
        afficherErreur(groupeDomaine, 'Choisis un domaine.');
        valide = false;
    } else {
        effacerErreur(groupeDomaine);
    }

    //  Validation Rythme 
    const groupeRythme = document.querySelector('input[name="rythme"]').closest('.groupe');
    const petitRythme  = groupeRythme.querySelector('.message-erreur');
    if (!rythme) {
        if (petitRythme) petitRythme.textContent = 'Choisis ton rythme.';
        valide = false;
    } else {
        if (petitRythme) petitRythme.textContent = '';
    }

    // ── Validation Intérêts (min. 2) ──
    const groupeInterets = document.querySelector('.groupe-cases').closest('.groupe');
    const petitInterets  = groupeInterets.querySelector('.message-erreur');
    if (interets.length < 2) {
        if (petitInterets) petitInterets.textContent = 'Sélectionne au moins 2 centres d\'intérêt.';
        valide = false;
    } else {
        if (petitInterets) petitInterets.textContent = '';
    }

    if (!valide) return;

  
    //  GÉNÉRATION DE LA CARTE PROFIL
   
    const initiales   = (prenom.value.trim()[0] + nom.value.trim()[0]).toUpperCase();
    const rythmeLabel = rythme.value === 'leve-tot'
        ? '<i class="ti ti-sun"></i> Lève-tôt'
        : '<i class="ti ti-moon"></i> Couche-tard';

    const etiquettesHTML = interets.map(i => `
        <span class="etiquette">
            <i class="ti ${icones[i.value] || 'ti-star'}"></i>
            ${i.value}
        </span>
    `).join('');

    const bioVal = bio.value.trim();
    const bioHTML = bioVal
        ? `<div class="profil-ligne" style="flex-direction:column; gap:6px;">
               <strong><i class="ti ti-pencil"></i> Présentation</strong>
               <p class="texte-bio">${bioVal}</p>
           </div>`
        : '';

    document.getElementById('carteProfil').innerHTML = `
        <div class="profil">

            <div class="profil-entete">
                <div class="initiales">${initiales}</div>
                <div class="profil-entete-texte">
                    <h2>${prenom.value.trim()} ${nom.value.trim()}</h2>
                    <span><i class="ti ti-briefcase"></i> ${domaine.value}</span>
                </div>
            </div>

            <div class="profil-ligne">
                <strong><i class="ti ti-mail"></i> E-mail</strong>
                <span>${email.value.trim()}</span>
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


document.getElementById('carteProfil').innerHTML = `
    <div class="etat-vide">
        <i class="ti ti-id-badge"></i>
        <p>Remplis le formulaire et ta carte<br>de profil apparaîtra ici</p>
    </div>
`;
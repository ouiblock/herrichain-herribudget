/**
 * Algorithme de minimisation des transactions (Debt Simplification)
 * @param {Array} participants - Liste des participants [{id, nom}]
 * @param {Array} depenses - Liste des dépenses [{montant, payeurId, parts: [{participantId, montant}]}]
 * @returns {Array} - Liste des transactions pour solder les comptes [{de, vers, montant}]
 */
export function calculerRemboursements(participants, depenses) {
  // 1. Calculer le solde net de chaque participant
  const soldes = {};
  participants.forEach(p => {
    soldes[p.id] = 0;
  });

  depenses.forEach(dep => {
    // Le payeur voit son solde augmenter
    if (soldes[dep.payeurId] !== undefined) {
      soldes[dep.payeurId] += dep.montant;
    }
    
    // Les personnes impliquées voient leur solde diminuer de leur part
    dep.parts.forEach(part => {
      if (soldes[part.participantId] !== undefined) {
        soldes[part.participantId] -= part.montant;
      }
    });
  });

  // 2. Séparer créanciers et débiteurs
  const creanciers = [];
  const debiteurs = [];
  
  Object.entries(soldes).forEach(([id, solde]) => {
    if (solde > 0.01) {
      creanciers.push({ id, montant: solde });
    } else if (solde < -0.01) {
      debiteurs.push({ id, montant: Math.abs(solde) });
    }
  });

  // Trier pour optimiser un peu (les plus gros montants d'abord)
  creanciers.sort((a, b) => b.montant - a.montant);
  debiteurs.sort((a, b) => b.montant - a.montant);

  // 3. Minimiser les transactions
  const transactions = [];
  let i = 0;
  let j = 0;
  
  while (i < creanciers.length && j < debiteurs.length) {
    const creancier = creanciers[i];
    const debiteur = debiteurs[j];
    
    const montantTransaction = Math.min(creancier.montant, debiteur.montant);
    
    // Arrondir à 2 décimales pour éviter les erreurs flottantes
    const montantArrondi = Math.round(montantTransaction * 100) / 100;
    
    if (montantArrondi > 0) {
      transactions.push({
        de: debiteur.id,
        vers: creancier.id,
        montant: montantArrondi
      });
    }

    creancier.montant -= montantArrondi;
    debiteur.montant -= montantArrondi;

    if (creancier.montant < 0.01) i++;
    if (debiteur.montant < 0.01) j++;
  }

  return transactions;
}

/**
 * Génère un texte de résumé pour les remboursements
 */
export function genererTextPartage(groupe, transactions, participants) {
  const noms = Object.fromEntries(participants.map(p => [p.id, p.nom]));

  if (transactions.length === 0) {
    return `🧾 ${groupe.nom} — Herricount\n\n✅ Les comptes sont à l'équilibre !\n\nCalculé avec Herribudget — 100% local, 0 tracking`;
  }

  const lignes = transactions.map(t =>
    `• ${noms[t.de]} doit ${t.montant.toFixed(2)} € à ${noms[t.vers]}`
  );

  return `🧾 ${groupe.nom} — Herricount
📅 ${new Date().toLocaleDateString('fr-FR')}

💰 Remboursements à effectuer :
${lignes.join('\n')}

Calculé avec Herribudget — 100% local, 0 tracking`.trim();
}

/**
 * Fonction de partage native
 */
export async function partagerResultats(groupe, transactions, participants) {
  const texte = genererTextPartage(groupe, transactions, participants);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Herricount — ${groupe.nom}`,
        text: texte,
      });
      return true;
    } catch (err) {
      console.log('Partage annulé ou échoué', err);
    }
  }
  
  // Fallback -> copy to clipboard
  try {
    await navigator.clipboard.writeText(texte);
    alert('Résumé copié dans le presse-papier !');
    return true;
  } catch (err) {
    alert('Impossible de copier le texte généré.');
    return false;
  }
}

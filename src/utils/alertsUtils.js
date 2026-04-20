/**
 * Service de calcul des alertes budget en temps réel.
 * 100% local, basé sur les données Dexie.
 */

export const calculateAlerts = (revenus, chargesRecurrentes, chargesPonctuelles, epargne) => {
  const alerts = [];
  const today = new Date();
  const currentDay = today.getDate();

  // 1. Alerte de prélèvement imminent (dans les 3 prochains jours)
  chargesRecurrentes.forEach(charge => {
    const diff = charge.datePrelevement - currentDay;
    if (diff > 0 && diff <= 3) {
      alerts.push({
        id: `charge-soon-${charge.id}`,
        type: 'warning',
        title: 'Prélèvement imminent',
        message: `Votre charge "${charge.libelle}" de ${charge.montant}€ sera prélevée dans ${diff} jours.`,
        icon: 'calendar'
      });
    } else if (diff === 0) {
      alerts.push({
        id: `charge-today-${charge.id}`,
        type: 'danger',
        title: 'Prélèvement aujourd\'hui',
        message: `Votre charge "${charge.libelle}" de ${charge.montant}€ est prélevée aujourd'hui.`,
        icon: 'zap'
      });
    }
  });

  // 2. Alerte Autonomie (Seuil critique < 3 mois)
  const totalRevenus = revenus.reduce((acc, curr) => acc + curr.montant, 0);
  const totalCharges = chargesRecurrentes.reduce((acc, curr) => acc + curr.montant, 0);
  const capital = epargne.length > 0 ? epargne[0].capitalDisponible : 0;
  
  if (totalCharges > 0) {
    const autonomie = capital / totalCharges;
    if (autonomie < 3) {
      alerts.push({
        id: 'autonomie-low',
        type: 'danger',
        title: 'Réserve de sécurité basse',
        message: `Votre autonomie financière est de ${autonomie.toFixed(1)} mois. Le seuil recommandé est de 3 mois.`,
        icon: 'shield-alert'
      });
    }
  }

  // 3. Taux d'endettement (> 33%)
  if (totalRevenus > 0) {
    const taux = (totalCharges / totalRevenus) * 100;
    if (taux > 33) {
      alerts.push({
        id: 'debt-high',
        type: 'warning',
        title: 'Taux d\'endettement élevé',
        message: `Vos charges fixes représentent ${taux.toFixed(0)}% de vos revenus. Attention au seuil recommandé de 33%.`,
        icon: 'trending-up'
      });
    }
  }

  // 4. Charges ponctuelles à venir (dans les 7 jours)
  chargesPonctuelles.forEach(p => {
    if (p.statut === 'avenir') {
      const dateP = new Date(p.datePrevue);
      const diffTime = dateP - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays <= 7) {
        alerts.push({
          id: `ponctuelle-soon-${p.id}`,
          type: 'info',
          title: 'Charge ponctuelle proche',
          message: `La dépense "${p.libelle}" de ${p.montant}€ est prévue le ${dateP.toLocaleDateString('fr-FR')}.`,
          icon: 'clock'
        });
      }
    }
  });

  return alerts;
};

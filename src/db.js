import Dexie from 'dexie';

export const db = new Dexie('HerribudgetDB');

db.version(1).stores({
  profiles: '++id, name, type', // type: 'solo', 'couple', 'coloc', 'cloisonne'
  revenus: '++id, profileId, libelle, montant, frequence, type, date',
  charges_recurrentes: '++id, profileId, libelle, montant, frequence, categorie, datePrelevement, repartition',
  charges_ponctuelles: '++id, profileId, libelle, montant, datePrevue, statut', // statut: 'avenir', 'paye'
  credits: '++id, profileId, libelle, capitalRestant, mensualite, taux, dateFin',
  epargne: '++id, profileId, capitalDisponible, epargneAutomensuelle',
  objectifs_epargne: '++id, profileId, libelle, montantCible, dateCible, progression',
  cgu_acceptance: '++id, version, timestamp', 
  triggers_config: 'triggerKey, enabled, seuil, lastDismissed' // triggerKey will be the primary key
});

db.version(2).stores({
  herricount_groupes: '++id, nom, statut, dateCreation', // statut: 'actif', 'soldé'
  herricount_depenses: '++id, groupeId, dateDepense'
});

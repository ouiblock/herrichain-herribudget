import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogRGBD() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <button className="back-btn mb-8" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <h1 className="mb-8" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>RGPD et applications de budget : ce que vous ne savez (peut-être) pas</h1>
      
      <p className="text-light mb-8">
        La donnée financière est considérée comme l'une des données les plus sensibles sur le plan légal (avec les données de santé). Et pourtant, dans la course à "l'appli géniale pour gérer son compte", un principe crucial est trop souvent ignoré. Explications sur le vrai visage des applications budgétaires.
      </p>

      <h2 className="mb-4 text-primary mt-8">L'Open Banking : un accès inédit à toute votre intimité</h2>
      <p>
        La loi DSP2 (Directive Européenne sur les Services de Paiement) a ouvert la voie à "l'Open Banking" en France. Concrètement, cette loi permet à des start-ups de se brancher très facilement à vos comptes bancaires via des API, sous l'excuse légitime de classer vos achats "automatiquement".
        <br/><br/>
        Le problème est profond. Savoir quel jour vous payez la crèche, quelle pharmacie vous fréquentez, ou quelle cotisation politique vous honorez en dit parfois plus sur vous que vos relevés médicaux.
      </p>

      <h2 className="mb-4 text-primary mt-8">C'est RGPD conforme, mais est-ce éthique ?</h2>
      <p>
        Les applications qui relient vos comptes bancaires ne violent techniquement pas le Règlement Général sur la Protection des Données (RGPD). Elles disposent de Conditions Générales d'Utilisation "propres", de mentions "Données chiffrées" bien visibles, mais dans les faits : vos données transitent, sont classées et restent sur les serveurs informatiques de sociétés privées (souvent aux États-Unis). 
        <br/><br/>
        Pire encore, certaines applications freemium sont gratuites car l'entreprise revend les tendances comportementales anonymisées ou monétise votre parcours avec des publicités financières ciblées (crédits, rachats).  
      </p>

      <h2 className="mb-4 text-primary mt-8">Le "Privacy by Design" selon Herrichain</h2>
      <p>
        C'est pour endiguer ce phénomène que l'association à but non lucratif Herrichain, assistée par Artean Digital, a lancé Herribudget. La philosophie "Privacy by Design" impose de concevoir un logiciel de manière à protéger les données personnelles dès l'origine.
        <br/><br/>
        Herribudget prend ce précepte à la lettre : **il n'y a pas de serveur**. Pas de base de données externe. L'application tourne exclusivement dans le navigateur de l'utilisateur. Toute la partie "Base de données" est hébergée sur l'appareil du propriétaire (ordinateur portable ou smartphone). 
        <br/><br/>
        Est-ce que ça demande plus d'efforts ? Oui. L'utilisateur doit saisir manuellement ou importer ses grands ensembles de données lui-même. Mais c'est le seul moyen de garantir que ses données n'ont jamais, à aucune seconde, circulé sur un serveur réseau de Silicon Valley. Vous ne pouvez pas être fuité, puisque l'éditeur du logiciel n'a lui-même aucune idée du contenu de votre base de données locale. L'indépendance numérique est à ce prix.
      </p>

      <div className="mt-12 text-center">
        <button className="btn btn-primary" onClick={() => navigate('/')}>Retourner sur l'application</button>
      </div>
    </div>
  );
}

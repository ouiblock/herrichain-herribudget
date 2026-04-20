import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <button className="back-btn mb-8" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} />
        Retour à l'accueil
      </button>

      <h1 className="mb-8 text-center">Politique de Confidentialité</h1>
      <div className="card" style={{ padding: '2rem', lineHeight: '1.6' }}>
        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>1. Identité du responsable de traitement</h2>
        <p className="mb-6 text-light">
          Association Herrichain — représentée par Xavier CHAUMET-NICOLAS, Président.<br />
          Développement : Artean Digital — arteandigital.fr
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>2. Données collectées</h2>
        <p className="mb-6 text-light">
          Herribudget ne collecte <strong>AUCUNE donnée personnelle</strong>.<br />
          Toutes les données saisies dans l'application (revenus, charges, épargne) sont stockées exclusivement dans la mémoire locale de votre navigateur (IndexedDB), sur votre propre appareil. Ces données ne transitent jamais par nos serveurs.
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>3. Hébergement</h2>
        <p className="mb-6 text-light">
          Les fichiers statiques de l'application (HTML, CSS, JavaScript) sont hébergés sur Netlify Inc.<br />
          Netlify peut collecter des logs d'accès anonymisés (adresse IP tronquée, user-agent) à des fins de sécurité réseau, conformément à sa propre politique de confidentialité : netlify.com/privacy. Ces logs ne contiennent aucune donnée budgétaire utilisateur.
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>4. Cookies</h2>
        <p className="mb-6 text-light">
          L'application utilise le strict minimum de cookies requis par la loi :<br />
          - <strong>Cookie de consentement CGU</strong> (stockage local, durée 12 mois, indispensable au fonctionnement)<br />
          - <strong>Cookie de préférence de thème</strong> (clair/sombre, stockage local, non personnel)<br /><br />
          Aucun cookie publicitaire, analytique ou tiers n'est utilisé. Aucun cookie ne quitte votre appareil vers nos serveurs.
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>5. Droits des utilisateurs</h2>
        <p className="mb-6 text-light">
          Conformément au RGPD, vous disposez des droits suivants sur vos données :<br />
          - <strong>Droit d'accès :</strong> vos données sont accessibles directement dans l'application<br />
          - <strong>Droit à l'effacement :</strong> bouton "Réinitialiser toutes mes données" dans Paramètres<br />
          - <strong>Droit à la portabilité :</strong> export JSON disponible dans Paramètres<br /><br />
          Aucune demande auprès de l'association n'est nécessaire — vous êtes le seul responsable de traitement de vos propres données.
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>6. DPO</h2>
        <p className="mb-6 text-light">
          La désignation d'un DPO n'est pas requise (aucun traitement de données personnelles par l'association).
        </p>

        <h2 className="mb-4" style={{ fontSize: '1.25rem' }}>7. Modifications</h2>
        <p className="mb-0 text-light">
          Toute modification de cette politique est publiée sur cette page avec date de mise à jour.<br />
          <strong>Dernière mise à jour :</strong> Avril 2026.
        </p>
      </div>
    </div>
  );
};

export default Privacy;

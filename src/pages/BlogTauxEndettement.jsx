import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogTauxEndettement() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <button className="back-btn mb-8" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <h1 className="mb-8" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>Comment calculer son taux d'endettement en 2026 ?</h1>
      
      <p className="text-light mb-8">
        Le taux d'endettement est l'indicateur principal utilisé par les banques pour évaluer votre capacité à emprunter. Le Haut Conseil de Stabilité Financière (HCSF) a fixé des règles strictes qu'il est crucial de comprendre avant tout projet immobilier ou personnel.
      </p>

      <h2 className="mb-4 text-primary mt-8">Pourquoi le taux d'endettement est-il si important ?</h2>
      <p>
        Lorsque vous demandez un crédit (immobilier, voiture, ou consommation), l'établissement financier va toujours calculer la part de vos revenus qui est "mangée" par vos charges fixes. Selon les recommandations du HCSF, ce taux ne doit pas dépasser <strong>35%</strong> (assurance emprunteur incluse). Au-delà, on estime que le risque de surendettement est trop élevé et la banque refusera généralement le prêt.
      </p>

      <h2 className="mb-4 text-primary mt-8">La formule du calcul du taux d'endettement</h2>
      <div className="card my-6" style={{ background: 'var(--color-bg)', padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Taux d'endettement = (Charges fixes / Revenus nets) × 100</h3>
      </div>
      
      <h3 className="mb-2 mt-6">Quelles sont les charges fixes prises en compte ?</h3>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li>Les mensualités de crédits en cours (immobilier, auto, conso, renouvelable).</li>
        <li>Le loyer (si vous restez locataire et ne demandez pas un prêt pour une résidence principale).</li>
        <li>Les éventuelles pensions alimentaires versées.</li>
      </ul>

      <h3 className="mb-2 mt-6">Quels revenus nets utiliser ?</h3>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
        <li>Salaires nets ajustés (avant impôt à la source).</li>
        <li>Bénéfices professionnels (moyenne sur 3 ans pour les indépendants).</li>
        <li>Pensions de retraite.</li>
        <li>Revenus locatifs (pondérés à 70% par la plupart des banques pour compenser le risque locatif).</li>
      </ul>

      <h2 className="mb-4 text-primary mt-8">Exemple pratique</h2>
      <p>
        Imaginons un ménage qui gagne 4 000 € net par mois. Ils remboursent déjà un crédit auto de 350 € par mois.
        <br/><br/>
        Capacité d'endettement maximale (à 35%) : 4 000 € × 35% = 1 400 €.
        <br/><br/>
        Mensualité maximale qu'ils peuvent ajouter : 1 400 € - 350 € = <strong>1 050 €</strong> pour leur nouveau crédit.
      </p>

      <h2 className="mb-4 text-primary mt-8">Visualiser en temps réel avec Herribudget</h2>
      <p>
        Calculer ce chiffre sur un coin de table est utile, mais les feuilles de paie et les charges changent au fil des mois. Avec une application souveraine comme <strong>Herribudget</strong>, votre taux d'endettement est actualisé automatiquement en fonction des crédits et des salaires que vous déclarez localement. Vous savez ainsi immédiatement si votre projet tient la route face aux critères du HCSF, sans même avoir besoin de consulter un banquier dans l'immédiat.
      </p>

      <div className="mt-12 text-center">
        <button className="btn btn-primary" onClick={() => navigate('/')}>Retourner sur l'application</button>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogBudgetPersonnel() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <button className="back-btn mb-8" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 0 }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <h1 className="mb-8" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>Budget personnel : 3 erreurs fatales à éviter absolument</h1>
      
      <p className="text-light mb-8">
        Gérer son propre argent ne s'apprend pas à l'école. Beaucoup de fausses croyances nous amènent à prendre de mauvaises décisions financières qui freinent notre autonomie. Voici 3 erreurs majeures et comment les éviter.
      </p>

      <h2 className="mb-4 text-primary mt-8">Erreur 1 : Attendre la fin du mois pour épargner</h2>
      <p>
        C'est l'erreur la plus commune. Vous payez vos factures, vous dépensez pour vos loisirs, votre alimentation, et vous vous dites que vous mettrez ce qu'il reste sur un livret A à la fin du mois. Spoiler : il ne reste généralement rien.
        <br/><br/>
        <strong>La solution : "Se payer en premier".</strong> Dès la réception du salaire, une somme doit être automatiquement transférée vers les comptes d'épargne. Considérez votre épargne comme une charge fixe inévitable. Si vous avez décidé de mettre 10% de votre salaire de côté, ces 10% doivent "disparaître" de votre compte courant dès le jour où vous les recevez.
      </p>

      <h2 className="mb-4 text-primary mt-8">Erreur 2 : Ne pas distinguer le budget mensuel du budget "lissé"</h2>
      <p>
        Vous gagnez 2 000 €, vos charges mensuelles sont de 1 200 €. Génial, il vous reste 800 €. Sauf que dans 4 mois, votre taxe foncière, votre assurance habitation annuelle et la révision de votre voiture vont "tomber" en même temps. Un mois classique devient soudainement un gouffre.
        <br/><br/>
        <strong>La solution : La mensualisation de l'annuel.</strong> Toutes les charges qui n'arrivent qu'une fois par an (Noël, impôts, vacances, assurances) doivent être listées, divisées par 12 et incluses dans les charges mensuelles. C'est l'objectif de l'outil <em>Charges Ponctuelles</em> dans Herribudget. En mettant cette portion de côté chaque mois, un coup dur à l'instant T ne sera plus jamais une mauvaise surprise, mais une dépense déjà provisionnée.
      </p>

      <h2 className="mb-4 text-primary mt-8">Erreur 3 : Ne pas faire travailler son fonds de sécurité</h2>
      <p>
        Une autre erreur est de posséder toute son épargne sur un seul livret standard non rémunérateur. L'objectif financier moderne recommande d'avoir une "réserve de sécurité" correspondant à de 3 à 6 mois de charges fixes, disponible immédiatement en cas de coup dur. Une fois ce "matelas" constitué, l'excédent doit être alloué sur d'autres projets ou investissements (sans quoi l'inflation grignote la valeur de votre capital chaque année).
        <br/><br/>
        <strong>La solution : L'indicateur d'Autonomie Financière.</strong> Dans les applications avancées comme Herribudget, cet indicateur est calculé en temps réel. Si vous savez que vos charges de survie sont couvertes pendant 4 mois par votre épargne de sécurité, vous abordez la vie sans stress, et pouvez allouer le reste sereinement.
      </p>

      <div className="mt-12 text-center">
        <button className="btn btn-primary" onClick={() => navigate('/')}>Retourner sur l'application</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Home, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { db } from '../db';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Data State
  const [situation, setSituation] = useState('solo'); // solo, couple, coloc
  const [firstName, setFirstName] = useState('');
  
  const [revenusBracket, setRevenusBracket] = useState(2); // 0 to 4
  const brackets = [
    { label: '< 1 000 €', val: 900 },
    { label: '1 000-2 000 €', val: 1500 },
    { label: '2 000-3 500 €', val: 2500 },
    { label: '3 500-5 000 €', val: 4000 },
    { label: '> 5 000 €', val: 5500 }
  ];
  const [autresRevenus, setAutresRevenus] = useState('');

  const [logementType, setLogementType] = useState('locataire'); // locataire, proprietaire, heberge
  const [logementMontant, setLogementMontant] = useState('');

  const [hasCredits, setHasCredits] = useState('non');
  const [creditsNumber, setCreditsNumber] = useState('1');

  const [epargneMontant, setEpargneMontant] = useState('');
  const [epargneObjectif, setEpargneObjectif] = useState('precaution'); 

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    // Save to Dexie
    const profileId = await db.profiles.add({
      name: firstName || 'Moi',
      type: situation
    });

    // Revenus
    await db.revenus.add({
      profileId,
      libelle: 'Revenus principaux',
      montant: brackets[revenusBracket].val, 
      frequence: 'mensuel',
      type: 'principal',
      date: new Date().toISOString()
    });

    if (autresRevenus && Number(autresRevenus) > 0) {
       await db.revenus.add({
         profileId,
         libelle: 'Autres revenus',
         montant: Number(autresRevenus),
         frequence: 'mensuel',
         type: 'secondaire',
         date: new Date().toISOString()
       });
    }

    // Logement
    if (logementType !== 'heberge' && logementMontant) {
       await db.charges_recurrentes.add({
         profileId,
         libelle: logementType === 'locataire' ? 'Loyer' : 'Mensualité Crédit Immo',
         montant: Number(logementMontant),
         frequence: 'mensuel',
         categorie: 'Logement',
         datePrelevement: 5,
         repartition: '100% Personnel'
       });
    }

    // Epargne
    await db.epargne.add({
      profileId,
      capitalDisponible: Number(epargneMontant) || 0,
      epargneAutomensuelle: 0
    });

    // Objectif
    await db.objectifs_epargne.add({
      profileId,
      libelle: 'Objectif Principal',
      montantCible: (Number(epargneMontant) || 0) + 5000, // arbitraire pour la demo
      dateCible: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      progression: '0'
    });

    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step fade-in">
            <h2>Quelle est votre situation ?</h2>
            <p>Cela nous aide à adapter les tableaux de bord (solo vs répartitions).</p>
            <div className="options-grid">
              <div className={`option-card ${situation === 'solo' ? 'selected' : ''}`} onClick={() => setSituation('solo')}>
                <User className="option-icon" size={32} />
                <h4>Seul(e)</h4>
              </div>
              <div className={`option-card ${situation === 'couple' ? 'selected' : ''}`} onClick={() => setSituation('couple')}>
                <Users className="option-icon" size={32} />
                <h4>En couple</h4>
              </div>
              <div className={`option-card ${situation === 'coloc' ? 'selected' : ''}`} onClick={() => setSituation('coloc')}>
                <Home className="option-icon" size={32} />
                <h4>Coloc / Famille</h4>
              </div>
            </div>
            <div className="form-group mt-4">
              <label className="form-label">Votre prénom (optionnel)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ex : Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
         return (
          <div className="onboarding-step fade-in">
            <h2>Vos revenus mensuels</h2>
            <p>Sélectionnez la tranche qui correspond à vos revenus réguliers nets.</p>
            <div className="range-slider">
               <input 
                 type="range" 
                 min="0" 
                 max="4" 
                 step="1" 
                 value={revenusBracket}
                 onChange={(e) => setRevenusBracket(Number(e.target.value))}
               />
               <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                 {brackets[revenusBracket].label}
               </div>
            </div>
            <div className="form-group mt-4">
              <label className="form-label">Autres revenus réguliers (optionnel)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Montant en € (ex: 150)"
                value={autresRevenus}
                onChange={(e) => setAutresRevenus(e.target.value)}
              />
            </div>
          </div>
         );
      case 3:
         return (
          <div className="onboarding-step fade-in">
            <h2>Votre logement</h2>
            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className={`option-card ${logementType === 'locataire' ? 'selected' : ''}`} onClick={() => setLogementType('locataire')}>
                <h4>Locataire</h4>
              </div>
              <div className={`option-card ${logementType === 'proprietaire' ? 'selected' : ''}`} onClick={() => setLogementType('proprietaire')}>
                <h4>Propriétaire</h4>
              </div>
              <div className={`option-card ${logementType === 'heberge' ? 'selected' : ''}`} onClick={() => setLogementType('heberge')}>
                <h4>Hébergé(e)</h4>
              </div>
            </div>
            {logementType !== 'heberge' && (
              <div className="form-group mt-4 fade-in">
                <label className="form-label">{logementType === 'locataire' ? 'Montant de votre loyer' : 'Mensualité de prêt immobilier'}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Montant en €"
                  value={logementMontant}
                  onChange={(e) => setLogementMontant(e.target.value)}
                />
              </div>
            )}
          </div>
         );
      case 4:
         return (
          <div className="onboarding-step fade-in">
            <h2>Avez-vous des crédits en cours ?</h2>
            <p>Hors crédit immobilier déjà renseigné (auto, conso...).</p>
            <div className="flex gap-4">
               <button 
                 className={`btn ${hasCredits === 'oui' ? 'btn-primary' : 'btn-outline'}`} 
                 style={{ flex: 1 }}
                 onClick={() => setHasCredits('oui')}
               >
                 Oui
               </button>
               <button 
                 className={`btn ${hasCredits === 'non' ? 'btn-primary' : 'btn-outline'}`} 
                 style={{ flex: 1 }}
                 onClick={() => setHasCredits('non')}
               >
                 Non
               </button>
            </div>
            {hasCredits === 'oui' && (
               <div className="form-group mt-4 fade-in">
                 <label className="form-label">Combien de crédits avez-vous ?</label>
                 <select 
                   className="form-control" 
                   value={creditsNumber} 
                   onChange={(e) => setCreditsNumber(e.target.value)}
                 >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                 </select>
               </div>
            )}
          </div>
         );
      case 5:
         return (
          <div className="onboarding-step fade-in">
            <h2>Où en est votre épargne ?</h2>
            <div className="form-group">
                <label className="form-label">Capital approximatif disponible (Livrets, etc.)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Montant en €"
                  value={epargneMontant}
                  onChange={(e) => setEpargneMontant(e.target.value)}
                />
            </div>
            <div className="form-group mt-4">
                 <label className="form-label">Quel est votre objectif principal ?</label>
                 <select 
                   className="form-control"
                   value={epargneObjectif}
                   onChange={(e) => setEpargneObjectif(e.target.value)}
                 >
                    <option value="precaution">Me constituer une épargne de précaution</option>
                    <option value="dettes">Rembourser mes dettes</option>
                    <option value="projet">Financer un projet (voyage, mariage...)</option>
                    <option value="investir">Investir</option>
                    <option value="suivre">Juste suivre mes dépenses</option>
                 </select>
            </div>
          </div>
         );
      default:
         return null;
    }
  };

  return (
    <div className="onboarding-page container">
      <div className="card onboarding-card">
        
        <div className="onboarding-progress">
          {[1,2,3,4,5].map(i => (
             <div key={i} className={`progress-bar ${i <= step ? 'active' : ''}`}></div>
          ))}
        </div>

        {renderStep()}

        <div className="onboarding-footer">
           {step > 1 ? (
             <button className="btn btn-outline" onClick={handlePrev}>
               <ArrowLeft size={18} /> Retour
             </button>
           ) : (
             <div></div>
           )}
           
           {step < totalSteps ? (
             <button className="btn btn-primary" onClick={handleNext}>
               Suivant <ArrowRight size={18} />
             </button>
           ) : (
             <button className="btn btn-primary" onClick={handleFinish}>
               Commencer avec Herribudget
             </button>
           )}
        </div>

        <div className="privacy-notice">
            <ShieldCheck size={14} />
            Ces informations sont stockées uniquement sur votre appareil.
        </div>

      </div>
    </div>
  );
};

export default Onboarding;

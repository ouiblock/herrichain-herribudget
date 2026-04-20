import React, { useState } from 'react';
import { ArrowLeft, Calculator, Plus, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import './CreditSimulator.css';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

const CreditSimulator = () => {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profiles.toCollection().first());
  
  // Scénarios
  const [scenarios, setScenarios] = useState([{
    id: 1,
    nom: 'Scénario 1',
    montant: 200000,
    dureeAnnees: 20,
    taux: 3.5,
    tauxAssurance: 0.36,
    fraisDossier: 1000,
    fraisGarantie: 2500,
  }]);

  const [activeScenarioId, setActiveScenarioId] = useState(1);

  const handleAddScenario = () => {
    if (scenarios.length >= 3) return;
    const newId = scenarios.length > 0 ? Math.max(...scenarios.map(s => s.id)) + 1 : 1;
    setScenarios([...scenarios, {
      id: newId,
      nom: `Scénario ${newId}`,
      montant: 200000,
      dureeAnnees: 20,
      taux: 3.5,
      tauxAssurance: 0.36,
      fraisDossier: 1000,
      fraisGarantie: 2500,
    }]);
    setActiveScenarioId(newId);
  };

  const handleRemoveScenario = (id) => {
    const updated = scenarios.filter(s => s.id !== id);
    setScenarios(updated);
    if (activeScenarioId === id && updated.length > 0) {
      setActiveScenarioId(updated[0].id);
    }
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Calculs M = C * (t / (1 - (1+t)^-n))
  const calculateResult = (scenario) => {
    const C = Number(scenario.montant) || 0;
    const dureeMois = (Number(scenario.dureeAnnees) || 0) * 12;
    const tauxAnnuel = Number(scenario.taux) || 0;
    const tauxMensuel = tauxAnnuel / 100 / 12;
    const tauxAssuranceStr = Number(scenario.tauxAssurance) || 0;

    let mensualiteHorsAssurance = 0;
    if (tauxMensuel > 0) {
      mensualiteHorsAssurance = C * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois)));
    } else {
      mensualiteHorsAssurance = dureeMois > 0 ? C / dureeMois : 0;
    }

    const coutAssuranceMensuel = C * (tauxAssuranceStr / 100 / 12);
    const mensualiteAvecAssurance = mensualiteHorsAssurance + coutAssuranceMensuel;

    const totalAssurance = coutAssuranceMensuel * dureeMois;
    const interetsTotaux = (mensualiteHorsAssurance * dureeMois) - C;
    const fraisDossierNum = Number(scenario.fraisDossier) || 0;
    const fraisGarantieNum = Number(scenario.fraisGarantie) || 0;
    
    const coutTotalCredit = interetsTotaux + totalAssurance + fraisDossierNum + fraisGarantieNum;
    
    // Estimation basique du TAEG
    const totalRembourse = C + coutTotalCredit;
    const taegEstime = dureeMois > 0 && C > 0 ? (((totalRembourse / C) ** (1 / (dureeMois/12))) - 1) * 100 : 0;

    return {
      mensualiteHorsAssurance: isFinite(mensualiteHorsAssurance) ? Math.ceil(mensualiteHorsAssurance) : 0,
      mensualiteAvecAssurance: isFinite(mensualiteAvecAssurance) ? Math.ceil(mensualiteAvecAssurance) : 0,
      interetsTotaux: isFinite(interetsTotaux) ? Math.ceil(interetsTotaux) : 0,
      totalAssurance: Math.ceil(totalAssurance),
      coutTotalCredit: isFinite(coutTotalCredit) ? Math.ceil(coutTotalCredit) : 0,
      taeg: isFinite(taegEstime) ? taegEstime.toFixed(2) : 0,
    };
  };

  const handleAjouterAuBudget = async (scenario) => {
    if (!profile) {
      alert("Profil introuvable.");
      return;
    }
    const res = calculateResult(scenario);
    if (!res.mensualiteAvecAssurance || isNaN(res.mensualiteAvecAssurance)) return;

    // Calcul de la date de fin
    const dateFin = new Date();
    dateFin.setFullYear(dateFin.getFullYear() + Number(scenario.dureeAnnees));
    const year = dateFin.getFullYear();
    const month = String(dateFin.getMonth() + 1).padStart(2, '0');

    await db.credits.add({
      profileId: profile.id,
      libelle: `Simulation: ${scenario.nom}`,
      capitalRestant: Number(scenario.montant),
      mensualite: res.mensualiteAvecAssurance,
      taux: Number(scenario.taux),
      dateFin: `${year}-${month}`
    });
    navigate('/dashboard/credits');
  };

  return (
    <div className="credit-simulator-page">
      <header className="dashboard-header mb-8">
        <div>
          <button className="back-btn mb-2" onClick={() => navigate('/dashboard/credits')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-light)', cursor: 'pointer', padding: 0}}>
            <ArrowLeft size={16} />
            Retour aux crédits
          </button>
          <h1>Simulateur de Crédit</h1>
          <p style={{color: 'var(--color-text-light)'}}>Calculez vos mensualités, TAEG et tableau d'amortissement en local.</p>
        </div>
      </header>

      {/* Tabs Scénarios */}
      <div className="tabs mb-4">
        {scenarios.map(s => (
          <button 
            key={s.id}
            className={`tab-btn ${activeScenarioId === s.id ? 'active' : ''}`}
            onClick={() => setActiveScenarioId(s.id)}
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
          >
            {s.nom}
            {scenarios.length > 1 && (
              <Trash2 size={14} color="var(--color-danger)" onClick={(e) => { e.stopPropagation(); handleRemoveScenario(s.id); }} />
            )}
          </button>
        ))}
        {scenarios.length < 3 && (
          <button className="btn btn-outline" onClick={handleAddScenario} style={{marginLeft: '0.5rem', padding: '0.25rem 0.75rem', height: '36px'}}>
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="simulator-grid">
        {/* Formulaire GAUCHE */}
        <div className="simulator-form card">
          <h3 className="mb-4">Paramètres du crédit</h3>
          
          {scenarios.map(scenario => scenario.id === activeScenarioId && (
            <div key={scenario.id}>
              {/* Le Crédit */}
              <div className="form-section mb-6">
                <h4 style={{fontSize: '0.875rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '1rem'}}>Le Crédit</h4>
                
                <div className="form-group">
                  <label className="form-label flex justify-between">
                    Montant emprunté (€)
                    <span style={{fontWeight: 'bold', color: 'var(--color-primary)'}}>{Number(scenario.montant).toLocaleString('fr-FR')} €</span>
                  </label>
                  <input type="range" min="1000" max="1000000" step="1000" className="range-slider" value={scenario.montant} onChange={e => updateScenario(scenario.id, 'montant', e.target.value)} />
                  <input type="number" className="form-control mt-2" value={scenario.montant} onChange={e => updateScenario(scenario.id, 'montant', e.target.value)} />
                </div>

                <div className="form-group mt-4">
                  <label className="form-label flex justify-between">
                    Durée (Années)
                    <span style={{fontWeight: 'bold', color: 'var(--color-primary)'}}>{scenario.dureeAnnees} ans</span>
                  </label>
                  <input type="range" min="1" max="35" step="1" className="range-slider" value={scenario.dureeAnnees} onChange={e => updateScenario(scenario.id, 'dureeAnnees', e.target.value)} />
                </div>

                <div className="form-group mt-4">
                  <label className="form-label">Taux d'intérêt annuel (%)</label>
                  <input type="number" step="0.01" className="form-control" value={scenario.taux} onChange={e => updateScenario(scenario.id, 'taux', e.target.value)} />
                </div>
              </div>

              {/* L'Assurance */}
              <div className="form-section mb-6">
                 <h4 style={{fontSize: '0.875rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '1rem'}}>Assurance Emprunteur</h4>
                 <div className="form-group">
                  <label className="form-label">Taux annuel assurance (%)</label>
                  <input type="number" step="0.01" className="form-control" value={scenario.tauxAssurance} onChange={e => updateScenario(scenario.id, 'tauxAssurance', e.target.value)} />
                </div>
              </div>

              {/* Frais Annexes */}
              <div className="form-section mb-2">
                 <h4 style={{fontSize: '0.875rem', color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '1rem'}}>Frais Annexes</h4>
                 <div className="flex gap-4">
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Frais de dossier (€)</label>
                    <input type="number" className="form-control" value={scenario.fraisDossier} onChange={e => updateScenario(scenario.id, 'fraisDossier', e.target.value)} />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label className="form-label">Frais de garantie (€)</label>
                    <input type="number" className="form-control" value={scenario.fraisGarantie} onChange={e => updateScenario(scenario.id, 'fraisGarantie', e.target.value)} />
                  </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* RECAP DROITE */}
        <div className="simulator-results card bg-gradient">
           {scenarios.map(scenario => {
             if(scenario.id !== activeScenarioId) return null;
             const res = calculateResult(scenario);
             
             const pieData = [
               { name: 'Capital', value: Number(scenario.montant) || 0, color: '#2D9B6F' },
               { name: 'Intérêts', value: res.interetsTotaux, color: '#F5A623' },
               { name: 'Assurance', value: res.totalAssurance, color: '#3A82F6' },
               { name: 'Frais', value: (Number(scenario.fraisDossier)||0) + (Number(scenario.fraisGarantie)||0), color: '#CBD5E1' }
             ];

             return (
               <div key={`res-${scenario.id}`} className="results-wrapper">
                 <h3 style={{marginBottom: '1.5rem', color: 'white'}}>Synthèse</h3>
                 
                 <div className="result-main-box" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left'}}>
                   <div>
                     <div style={{fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8}}>Mensualité estimée</div>
                     <div style={{fontSize: '2.5rem', fontWeight: 800}}>{res.mensualiteAvecAssurance.toLocaleString('fr-FR')} €</div>
                   </div>
                   <div style={{textAlign: 'right'}}>
                     <div style={{fontSize: '0.75rem', opacity: 0.8}}>Hors assurance</div>
                     <div style={{fontSize: '1.25rem', fontWeight: 600}}>{res.mensualiteHorsAssurance.toLocaleString('fr-FR')} €</div>
                   </div>
                 </div>

                 <div className="results-grid mt-6">
                   <div className="res-stat" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span>TAEG</span>
                     <strong>{res.taeg}%</strong>
                   </div>
                   <div className="res-stat" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span>Coût Crédit</span>
                     <strong>{res.coutTotalCredit.toLocaleString('fr-FR')} €</strong>
                   </div>
                   <div className="res-stat" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span>Intérêts</span>
                     <strong>{res.interetsTotaux.toLocaleString('fr-FR')} €</strong>
                   </div>
                   <div className="res-stat" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                     <span>Assurance</span>
                     <strong>{res.totalAssurance.toLocaleString('fr-FR')} €</strong>
                   </div>
                 </div>

                 <div className="mt-8">
                   <h4 style={{color: 'white', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase'}}>Répartition du coût global</h4>
                   <div style={{height: '200px'}}>
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value) => `${value.toFixed(2)} €`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                 </div>

                 <button className="btn btn-block mt-8" style={{background: 'white', color: 'var(--color-primary-dark)'}} onClick={() => handleAjouterAuBudget(scenario)}>
                   <Plus size={18} />
                   Ajouter ce crédit à mon budget
                 </button>
               </div>
             );
           })}
        </div>
      </div>

      <div className="card text-center mt-8 bg-light">
          <p style={{fontSize: '0.75rem', color: 'var(--color-text-light)', lineHeight: 1.6, margin: 0}}>
            <strong>Avertissement Légal :</strong> Cette simulation est fournie à titre purement indicatif et éducatif. Les résultats sont des estimations basées sur les paramètres saisis. Ils ne constituent pas une offre de crédit, un engagement contractuel, ni un conseil financier. Le TAEG calculé est une estimation — le TAEG réel proposé par un établissement de crédit peut différer. Herribudget n'est pas un établissement de crédit agréé. Consultez votre banque ou un courtier agréé ORIAS pour toute demande de financement.
          </p>
      </div>

    </div>
  );
};

export default CreditSimulator;

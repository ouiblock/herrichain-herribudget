import React, { useMemo } from 'react';
import { Search, Bell, Wallet, RefreshCcw, Landmark, AlertTriangle, AlertCircle, Info, Calendar as CalendarIcon, Zap, Clock, TrendingUp, ShieldAlert, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { calculateAlerts } from '../utils/alertsUtils';
import './Dashboard.css';

const Dashboard = () => {
  const revenus = useLiveQuery(() => db.revenus.toArray()) || [];
  const charges = useLiveQuery(() => db.charges_recurrentes.toArray()) || [];
  const chargesPonctuelles = useLiveQuery(() => db.charges_ponctuelles.toArray()) || [];
  const epargne = useLiveQuery(() => db.epargne.toArray()) || [];

  const totalRevenus = useMemo(() => revenus.reduce((acc, curr) => acc + curr.montant, 0), [revenus]);
  const totalCharges = useMemo(() => charges.reduce((acc, curr) => acc + curr.montant, 0), [charges]);
  const solde = totalRevenus - totalCharges;

  // Calcul des alertes réelles
  const activeAlerts = useMemo(() => 
    calculateAlerts(revenus, charges, chargesPonctuelles, epargne)
  , [revenus, charges, chargesPonctuelles, epargne]);

  // Préparation de la Timeline Réelle
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const items = [
      ...charges.map(c => ({
        id: `rec-${c.id}`,
        libelle: c.libelle,
        montant: c.montant,
        date: new Date(currentYear, currentMonth, c.datePrelevement),
        type: 'recurrente'
      })),
      ...chargesPonctuelles.filter(p => p.statut === 'avenir').map(p => ({
        id: `ponc-${p.id}`,
        libelle: p.libelle,
        montant: p.montant,
        date: new Date(p.datePrevue),
        type: 'ponctuelle'
      }))
    ];

    // Ne garder que le futur proche (30 jours) et trier
    return items
      .filter(item => item.date >= today)
      .sort((a,b) => a.date - b.date)
      .slice(0, 4);
  }, [charges, chargesPonctuelles]);

  // Calcul Autonomie
  const capitalEpargne = epargne.length > 0 ? epargne[0].capitalDisponible : 0;
  const autonomieMois = totalCharges > 0 ? (capitalEpargne / totalCharges).toFixed(1) : 0;

  // Préparation des données du PieChart basées sur les charges réelles
  const data = useMemo(() => {
    if (charges.length === 0) return [{ name: 'Aucune charge', value: 1, color: '#CBD5E1' }];
    
    // On groupe par libellé ou on prend juste les 4 plus grosses
    return charges
      .sort((a, b) => b.montant - a.montant)
      .slice(0, 4)
      .map((c, i) => ({
        name: c.libelle,
        value: c.montant,
        color: i === 0 ? '#2D9B6F' : i === 1 ? '#3A82F6' : i === 2 ? '#F5A623' : '#CBD5E1'
      }));
  }, [charges]);

  const totalChargesPonctuelles = useMemo(() => 
    chargesPonctuelles.reduce((acc, curr) => acc + curr.montant, 0)
  , [chargesPonctuelles]);

  // Calcul du % d'autonomie pour la jauge (ex: max 12 mois = 100%)
  const gaugePercent = useMemo(() => {
    const months = parseFloat(autonomieMois);
    if (months >= 12) return 100;
    return Math.round((months / 12) * 100);
  }, [autonomieMois]);

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Mon Budget</h1>
        </div>
         <div className="header-actions">
            <div className="search-bar">
              <Search size={18} className="text-light" />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button className="btn notification-btn" aria-label="Notifications" style={{position: 'relative'}}>
              <Bell size={24} color="var(--color-text-light)" />
              {activeAlerts.length > 0 && (
                <span className="notification-badge">{activeAlerts.length}</span>
              )}
            </button>
         </div>
      </header>

      {/* Real-time Alerts Section */}
      {activeAlerts.length > 0 && (
        <div className="alerts-banner mb-6">
          {activeAlerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.type}`}>
               <div className="alert-icon">
                 {alert.icon === 'zap' && <Zap size={18} />}
                 {alert.icon === 'calendar' && <CalendarIcon size={18} />}
                 {alert.icon === 'shield-alert' && <ShieldAlert size={18} />}
                 {alert.icon === 'trending-up' && <TrendingUp size={18} />}
                 {alert.icon === 'clock' && <Clock size={18} />}
               </div>
               <div className="alert-content">
                 <div className="alert-title">{alert.title}</div>
                 <div className="alert-message">{alert.message}</div>
               </div>
               <ChevronRight size={16} className="alert-chevron" />
            </div>
          ))}
        </div>
      )}

      {/* Main Grid Top */}
      <div className="dashboard-top-grid">
        <div className="card balance-card">
           <div className="wallet-icon-bg">
             <Wallet size={24} />
           </div>
           <div className="balance-label">SOLDE NET DISPONIBLE</div>
           <div className="balance-amount">
             {solde > 0 ? '+' : ''}{solde.toLocaleString('fr-FR')} €
           </div>
           <div className="balance-metrics">
             <div className="metric">
               <div className="metric-label">Revenus ce mois</div>
               <div className="metric-value" style={{color: '#4ade80'}}>+ {totalRevenus.toLocaleString('fr-FR')} €</div>
             </div>
             <div className="metric">
               <div className="metric-label">Dépenses prévues</div>
               <div className="metric-value" style={{color: '#fca5a5'}}>- {totalCharges.toLocaleString('fr-FR')} €</div>
             </div>
           </div>
        </div>

        <div className="card gauge-card">
           <h3 style={{fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'left'}}>Autonomie Financière</h3>
           
           <div className="circular-gauge" style={{'--percent': gaugePercent}}>
              <div className="gauge-inner">
                <h3>{gaugePercent}%</h3>
                <span>SÉCURITÉ</span>
              </div>
            </div>

           <p className="gauge-text">
             Vous avez <strong>{autonomieMois} mois</strong> de réserve de sécurité au rythme actuel.
           </p>
        </div>
      </div>

      {/* Main Grid Charts & Lists */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h3 style={{fontSize: '1rem', marginBottom: '1.5rem'}}>Répartition des dépenses</h3>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ width: '150px', height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend" style={{ flex: 1, paddingLeft: '1rem' }}>
                {charges.length === 0 ? (
                   <p style={{fontSize: '0.75rem', color: 'var(--color-text-light)'}}>Aucune donnée</p>
                ) : data.map(item => (
                  <div key={item.name} className="legend-item" style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color}}></div>
                      <span style={{fontSize: '0.75rem'}}>{item.name}</span>
                    </div>
                    <span style={{fontWeight: 600, fontSize: '0.75rem'}}>{item.value.toLocaleString('fr-FR')}€</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="blocks-stack">
           <div className="card info-block">
             <div className="info-icon">
               <RefreshCcw size={24} />
             </div>
             <div>
               <div style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem'}}>Charges Récurrentes</div>
               <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{totalCharges.toLocaleString('fr-FR')} €</div>
               <div style={{fontSize: '0.75rem', color: 'var(--color-text-light)'}}>{charges.length} prélèvements actifs</div>
             </div>
           </div>

           <div className="card info-block">
             <div className="info-icon" style={{color: 'var(--color-warning)'}}>
               <Landmark size={24} />
             </div>
              <div>
                <div style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', marginBottom: '0.25rem'}}>Charges Ponctuelles</div>
                <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{totalChargesPonctuelles.toLocaleString('fr-FR')} €</div>
                <div style={{fontSize: '0.75rem', color: 'var(--color-text-light)'}}>{chargesPonctuelles.length} à venir</div>
              </div>
           </div>
        </div>

        <div className="card">
           <h3 style={{fontSize: '1rem'}}>Prochaines échéances</h3>
           <div className="timeline">
             {upcomingEvents.length === 0 ? (
               <p style={{fontSize: '0.875rem', color: 'var(--color-text-light)', padding: '1rem 0'}}>Aucune échéance prévue dans les 30 prochains jours.</p>
             ) : upcomingEvents.map((event, idx) => {
               const isToday = event.date.toDateString() === new Date().toDateString();
               const isTomorrow = event.date.toDateString() === new Date(Date.now() + 86400000).toDateString();
               
               return (
                 <div key={event.id} className="timeline-item">
                   <div className={`timeline-dot ${isToday || isTomorrow ? 'soon' : ''}`}></div>
                   <div className="timeline-content">
                      <div className="timeline-date" style={{color: isToday || isTomorrow ? 'var(--color-primary)' : 'inherit'}}>
                        {isToday ? 'AUJOURD\'HUI' : isTomorrow ? 'DEMAIN' : event.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()}
                      </div>
                      <div className="timeline-details">
                        <div>
                          <h4 style={{margin: 0}}>{event.libelle}</h4>
                        </div>
                        <p style={{margin: 0, fontWeight: 600}}>- {event.montant.toLocaleString('fr-FR')} €</p>
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

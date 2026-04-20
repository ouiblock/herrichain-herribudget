import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages to be created
import LandingPage from './pages/LandingPage.jsx';
import CGU from './pages/CGU.jsx';
import Privacy from './pages/Privacy.jsx';
import Legal from './pages/Legal.jsx';
import BlogTauxEndettement from './pages/BlogTauxEndettement.jsx';
import BlogBudgetPersonnel from './pages/BlogBudgetPersonnel.jsx';
import BlogRGPD from './pages/BlogRGPD.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Revenus from './pages/Revenus.jsx';
import Charges from './pages/Charges.jsx';
import Epargne from './pages/Epargne.jsx';
import Credits from './pages/Credits.jsx';
import CreditSimulator from './pages/CreditSimulator.jsx';
import Settings from './pages/Settings.jsx';
import Herricount from './pages/Herricount.jsx';
import GroupeDetail from './components/herricount/GroupeDetail.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/terms" element={<CGU />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/blog/taux-endettement" element={<BlogTauxEndettement />} />
        <Route path="/blog/budget-personnel" element={<BlogBudgetPersonnel />} />
        <Route path="/blog/rgpd-budget" element={<BlogRGPD />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="revenus" element={<Revenus />} />
          <Route path="charges" element={<Charges />} />
          <Route path="epargne" element={<Epargne />} />
          <Route path="credits" element={<Credits />} />
          <Route path="credits/simulateur" element={<CreditSimulator />} />
          <Route path="parametres" element={<Settings />} />
          <Route path="herricount" element={<Herricount />} />
          <Route path="herricount/:id" element={<GroupeDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

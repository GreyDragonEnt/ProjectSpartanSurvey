import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SurveyProvider } from './context/SurveyContext';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import CreateSurvey from './pages/CreateSurvey';
import ViewSurvey from './pages/ViewSurvey';
import SurveyResults from './pages/SurveyResults';
import { Toaster } from './components/ui/Toaster';
import Navbar from './components/layout/Navbar';
import FourOhFour from './pages/FourOhFour';

function App() {
  return (
    <Router>
      <SurveyProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create" element={<CreateSurvey />} />
            <Route path="/survey/:id" element={<ViewSurvey />} />
            <Route path="/results/:id" element={<SurveyResults />} />
            <Route path="*" element={<FourOhFour />} />
          </Routes>
          <Toaster />
        </div>
      </SurveyProvider>
    </Router>
  );
}

export default App;
/// <reference path="../preload.d.ts" />

import { createRoot } from 'react-dom/client';
import '../css/style.less';

import './popup-view.less';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import SecurityCheck from '../routes/SecurityCheck/SecurityCheck';
import SecurityNotifications from '../routes/SecurityNotifications/SecurityNotifications';
import SecurityAddressbarPopup from '../routes/SecurityAddressbarPopup/SecurityAddressbarPopup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/security-check" element={<SecurityCheck />} />
        <Route path="/security-notifications" element={<SecurityNotifications />} />
        <Route path="/security-addressbarpopup" element={<SecurityAddressbarPopup />} />

      </Routes>
    </Router>
  );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
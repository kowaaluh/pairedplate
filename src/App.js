import Main from './components/Main';
import PrivacyPolicy from './components/PrivacyPolicy';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/privacy"
                element={
                  <PrivacyPolicy />
                }
            />
            <Route
                path="/"
                element={<Main/>}
            />
            <Route
                path="*"
                element={<Navigate to="/" element={<Main/>} replace />}
            />
        </Routes>
      </BrowserRouter>
  );
}

export default App

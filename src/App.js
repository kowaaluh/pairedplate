import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import Main from './components/Main';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsofService from './components/TermsofService';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Details from './components/Details';
import Confirmation from './components/Confirmation';
import Forgot from './components/Forgot';
import React, { useState } from 'react';
import {  Navigate, Route, Routes} from 'react-router-dom';

Amplify.configure(awsmobile);

function App() {
const [isAuthenticated, setIsAuthenticated] = useState(false)

function updateAuthStatus(authStatus) {
    setIsAuthenticated(authStatus)
}

  return (
      <div>
          <NavBar isAuthenticated={isAuthenticated} updateAuthStatus={updateAuthStatus}/>
              <Routes>
                <Route path="/details/:restaurantId"
                    element={
                      <Details isAuthenticated={isAuthenticated} />
                    }
                />
                <Route path="/privacy"
                    element={
                      <PrivacyPolicy />
                    }
                />
                <Route path="/termsofservice"
                    element={
                      <TermsofService />
                    }
                />
                <Route path="/forgot"
                    element={
                      <Forgot />
                    }
                />
                <Route path="/signup"
                    element={
                      <SignUp />
                    }
                />
                <Route path="/confirmation"
                    element={
                      <Confirmation updateAuthStatus={updateAuthStatus} />
                    }
                />
                <Route path="/login"
                    element={
                      <Login updateAuthStatus={updateAuthStatus} />
                    }
                />
                <Route
                    path="/"
                    element={
                        <Main isAuthenticated={isAuthenticated} />
                    }
                />
                <Route
                    path="/user/:userId"
                    element={
                        <UserProfile isAuthenticated={isAuthenticated}/>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to="/" element={<Main isAuthenticated={isAuthenticated} />} replace />}
                />
            </Routes>
          <Footer/>
      </div>
  );
}

export default App

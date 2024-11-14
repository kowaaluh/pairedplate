import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import Main from './components/Main';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import PrivacyPolicy from './components/PrivacyPolicy';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Details from './components/Details';
import Confirmation from './components/Confirmation';
import Forgot from './components/Forgot';
import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

Amplify.configure(awsExports);

function App() {
const [isAuthenticated, setIsAuthenticated] = useState(false)

function updateAuthStatus(authStatus) {
    setIsAuthenticated(authStatus)
}

  return (
      <div>
          <NavBar isAuthenticated={isAuthenticated} updateAuthStatus={updateAuthStatus}/>
              <Routes>
                <Route path="/details/:restaurant"
                    element={
                      <Details />
                    }
                />
                <Route path="/privacy"
                    element={
                      <PrivacyPolicy />
                    }
                />
                <Route path="/forgot"
                    element={
                      <Forgot />
                    }
                />
                <Route path="/signup"
                    element={
                      <SignUp updateAuthStatus={updateAuthStatus} />
                    }
                />
                <Route path="/confirmation"
                    element={
                      <Confirmation />
                    }
                />
                <Route path="/login"
                    element={
                      <Login />
                    }
                />
                <Route
                    path="/"
                    element={
                        <Main/>
                    }
                />
                <Route
                    path="/user/:user"
                    element={
                        <UserProfile isAuthenticated={isAuthenticated}/>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to="/" element={<Main/>} replace />}
                />
            </Routes>
      </div>
  );
}

export default App

import React from 'react';
import { signOut } from 'aws-amplify/auth';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

const NavBar = (props) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            props.updateAuthStatus(false);
            navigate('/');
            await signOut({ global: true });
        } catch (err) {  }
    }
    const handleUserPage = async () => {
        try {
            const { userId } = await getCurrentUser();
            navigate(`/user/${userId}`);
        } catch (err) {  }
    }

  return (
    <div className="bg-white border-b sticky top-0 z-30 flex items-center justify-between">
        <header className="bg-white p-4 relative overflow-hidden">
            <img
              src={logo}
              alt="Paired Plate"
              className="h-8 w-auto object-contain"
              onClick={() => navigate('/')}
            />
        </header>
      { props.isAuthenticated === false && (
        <div className="flex absolute right-5 space-x-4">
          <button
            onClick={() => navigate('/login') }
            className="text-xs font-bold bg-green-950 text-white px-4 py-2.5 rounded-full hover:bg-green-900"
          >
          Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-xs font-bold bg-yellow-600 text-white px-4 py-2.5 rounded-full hover:bg-yellow-500"
          >
            Sign up
          </button>
        </div>
      ) }
      {
        props.isAuthenticated !== false && (
            <div className="flex absolute right-5 space-x-4">
              <button
                onClick={handleUserPage}
                className="text-xs font-bold bg-green-950 text-white px-4 py-2.5 rounded-full hover:bg-green-900"
              >
              Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-bold bg-yellow-600 text-white px-4 py-2.5 rounded-full hover:bg-yellow-500"
              >
                Sign out
              </button>
            </div>
      )}
    </div>
  );
}

export default NavBar;
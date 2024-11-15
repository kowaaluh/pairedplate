import React , { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useNavigate, Link } from 'react-router-dom';
import { getUser } from '../graphql/queries';
import { client } from "../graphql/client";
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from "aws-amplify/auth";

function Login(props) {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [error, setError] = useState('');

   function isValidEmail() {
     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     return emailRegex.test(email);
   }

   const handleSignIn = async (event) => {
     event.preventDefault();
     setPasswordError('');
     setEmailError('');
     setError('');

     if (isValidEmail(email)!==true) {
        setEmailError('Please enter a valid email.');
        return;
     }
     const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
     if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long, contain a number, and a special character.');
      return;
     }

      try {
        setEmail(email.toLowerCase());
        const response = await signIn ({
          username: email,
          password,
        });
        const { userId } = await getCurrentUser();
        props.updateAuthStatus(true)
        navigate(`/user/${userId}`);
      } catch (error) {
        if (error.message === "There is already a signed in user."){
            await signOut({ global: true });
            setError("Something went wrong, please sign in again.");
        } else {
            setError("Log in failed.");
        }
      }
   }

  return (
    <>
        <div className="bg-gray-50 flex flex-col min-h-screen">
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Log In
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6">
                <div>
                  {error && <p className="mt-4 text-yellow-600 text-sm">{error}</p>}
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email Address
                  </label>
                  {emailError && <p className="mt-4 text-yellow-600 text-sm">{emailError}</p>}
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      onChange={event => setEmail(event.target.value)}
                      autoComplete="email"
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      onChange={event => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm/6"
                    />
                  </div>
                  <div className="flex justify-end text-sm">
                    <Link className="font-semibold text-green-900 hover:text-green-800" to="/forgot">Forgot password?</Link>
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleSignIn}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                  >
                    Log In
                  </button>
                </div>
              </form>
            </div>
          </>
        </div>
    </>
  );
}

export default Login;
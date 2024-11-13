import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import { signUp } from 'aws-amplify/auth';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

    const handleSignUp = async (event) => {
     event.preventDefault();
         const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
         if (!passwordRegex.test(password)) {
          setError('Password must be at least 8 characters long, contain a number, and a special character.');
           return;
         }
         setError('');
      try {
        const customEmail = email.toLowerCase();
        const response = await signUp({
          username: customEmail,
          password,
          options: {
            userAttributes: {
              email: customEmail,
            },
          },
        });
         navigate('/confirmation');
      } catch (error) {
        console.error("Error during sign-up:", error);
        throw new Error("Sign-up failed, please try again later.");
      }
    }

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form id="signupForm" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email Address
              </label>
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
              {error && <p className="mt-4 text-yellow-600 text-sm">{error}</p>}
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={event => setPassword(event.target.value)}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleSignUp}
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
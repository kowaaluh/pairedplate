import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import { confirmSignUp } from 'aws-amplify/auth';
import { createUser } from '../graphql/mutations';
import { client } from "../graphql/client";

function Confirmation(props) {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleConfirmSignUp = async (event) => {
         event.preventDefault();
          try {
            const customEmail = email.toLowerCase();
            const response = await confirmSignUp({
              username: customEmail,
              confirmationCode
            });
             console.log(response);
             addNewUser();

          } catch (error) {
            console.error("Error during sign-up:", error);
            throw new Error("Sign-up failed, please try again later.");
          }
    }

    const addNewUser = async () => {
        console.log("present");

        const newUser = {
            id: uuid(),
            email: email
        };
          try {
              const response = await client.graphql({
                 query: createUser,
                 variables: {
                   id: newUser.id,
                   email: newUser.email,
                 },
              });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        navigate('/user/${newUser.id}');
        props.updateAuthStatus(true)
    }

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Confirm Your Email
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
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Confirmation Code
              </label>
              <div className="mt-2">
                <input
                  id="confirmationCode"
                  name="confirmationCode"
                  type="string"
                  required
                  onChange={event => setConfirmationCode(event.target.value)}
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleConfirmSignUp}
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Confirmation;
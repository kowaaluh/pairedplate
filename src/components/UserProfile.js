import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { updateUser } from '../graphql/mutations';
import { listUsers } from '../graphql/queries';
import { client } from "../graphql/client";
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import {Amplify} from 'aws-amplify';
import awsmobile from '../aws-exports';
import user from '../assets/user.png';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

Amplify.configure({...awsmobile, aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"});

function UserProfile(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hideUsername, setHideUsername] = useState(true);
  const [hideForm, setHideForm] = useState(true);
  const [hideReviews, setHideReviews] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');

  const hasUsername = (value) => value && value.trim() !== "";

  function showForm() {
   setHideForm(false);
  }

  const updateUsername = async () => {
      try {
          const userData = { username: updatedUsername };

          const response = await client.graphql({
             query: updateUser,
             variables: { input: userData }
          });
          console.log(response);

      } catch (error) {
        setError("Confirmation failed, please try again later.");
      }
  }

  useEffect(() => {
    {
        if ( props.isAuthenticated === false ){
            navigate('/');
        }
        const getUser = async () => {
         try {
//           Todo: look into this
//           await fetchAuthSession({ forceRefresh: true });
//           console.log("refresh time");

           const response = await client.graphql({ query: listUsers });
           console.log("good", response);

           if (response && response.data.listUsers.items.length > 0) {
            setUser(response.data.listUsers.items[0]);
            if (hasUsername(user.username)){
                setHideUsername(false);
            }
            if (user.reviews !== null || user.reviews !== undefined) {
              setReviews(user.reviews);
              setHideReviews(false);
            }
           } else {
             setUser(null);
             setHideUsername(true);
           }
           setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
//            Todo: uncomment
//            navigate('/');
//            setHideUsername(true);
//            await signOut({ global: true });
          }
        };
        getUser();
    }
  }, []);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <img
          src={user}
          alt="Blank user picture"
          className="m-8 w-32 h-32 rounded-full mx-auto"
        />
        {hideUsername ? (
            <div className="d-flex align-items-center">
                <h1 className="text-center text-2xl font-semibold mt-3">Welcome!</h1>
                <PlusIcon className="w-6 h-6" onClick={updateUsername}/>
            </div>
        ) : (
            <div className="d-flex align-items-center">
                <h1 className="text-center text-2xl font-semibold mt-3">Hi, {user.username}</h1>
                <PlusIcon className="w-6 h-6" onClick={updateUsername}/>
            </div>
        )}

        {
           hideForm === true && (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                        Change Username
                      </label>
                      {error && <p className="mt-4 text-yellow-600 text-sm">{error}</p>}
                      <div className="mt-2">
                        <input
                          id="username"
                          name="username"
                          type="username"
                          required
                          onChange={event => setUpdatedUsername(event.target.value)}
                          autoComplete="username"
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={updateUsername}
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                      >
                        Confirm
                      </button>
                    </div>
                </form>
            </div>
        )}
        {
           hideReviews === true && (
            <div className="m-4 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <h1 className="text-center text-2xl font-semibold mt-3">Reviews</h1>
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                        <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                        <div>Loading ...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {reviews.map((review) => (
                          <div key={review.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{review.rating}</div>
                          <span className="text-center font-bold text-2xl text-black mb-2">
                              {review.message}
                          </span>
                          </div>
                        ))}
                    </div>
                  )}
              </section>
            </div>
        )}
    </div>
  </>
  );
}

export default UserProfile;
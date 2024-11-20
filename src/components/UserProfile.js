import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listReviews, listRestaurants  } from '../graphql/queries';
import { client } from "../graphql/client";
import userIcon from '../assets/userIcon.png';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


//import awsmobile from '../aws-exports';
//import {Amplify} from 'aws-amplify';
//Amplify.configure({...awsmobile, aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"});

function UserProfile(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState('');
  const [restaurants, setRestaurants] = useState('');
  const [showError, setShowError] = useState(false);
  const [hideReviews, setHideReviews] = useState(true);

    const getReviews = async () => {
     try {
       setError("");
       setShowError(false);
       const response = await client.graphql({
          query: listReviews
       });

       setReviews(response);
       setHideReviews(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError("You have no reviews.");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    const getRestaurants = async () => {
      try {
      setError("");
      setShowError(false);
      const variables = {
        filter: {
          rating: {
            eq: 5
          }
        }
      };
       const response = await client.graphql({
         query: listRestaurants,
         variables: variables,
       });
       setRestaurants(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Unable to show restaurants at this time.");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() =>
    {
        if ( props.isAuthenticated === false ){
            navigate('/');
        }

        getReviews();
        getRestaurants();

  }, [props, navigate]);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <img
          src={userIcon}
          alt="User icon"
          className="m-8 w-20 h-20 rounded-full mx-auto"
        />
        <div className="flex items-center justify-center">
            <h1 className="text-center text-2xl font-semibold">Welcome!</h1>
        </div>
        { showError === true && (
            <div className="mb-4 mx-auto p-6 bg-gray-50 rounded-lg">
                <div className="px-4 sm:px-8 max-w-5xl m-auto">
                  {error && <span className="rounded-lg bg-yellow-600 py-1 px-4 text-center text-white font-bold text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                    {error}
                  </span>}
                </div>
            </div>
        )}
        {   hideReviews === false && (
            <div className="m-4 relative flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                        <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                        <div>Loading ...</div>
                    </div>
                  ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {reviews?.map((review) => (
                          <div key={review.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{review.rating}</div>
                          <span className="text-center font-bold text-2xl text-black mb-2">
                              {review.message}
                          </span>
                          </div>
                        ))}
                    </div>
                  </>
                  )}
              </section>
            </div>
        )}
        <span className="m-4 text-center font-bold text-xl text-black mb-2">
            See the latest 5 star restaurants...
        </span>
    </div>
  </>
  );
}

export default UserProfile;
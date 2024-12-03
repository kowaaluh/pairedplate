import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, listReviews } from '../graphql/queries';
import { updateRestaurant } from '../graphql/mutations';
import { client } from "../graphql/client";
import Rating from 'react-rating-stars-component';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { createReview } from '../graphql/mutations';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from 'aws-amplify/auth';
import { size, count, starColor, isHalf, edit } from '../config/constants.js';
import awsmobile from '../aws-exports';
import {Amplify} from 'aws-amplify';

Amplify.configure({...awsmobile, aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"});

function Details(props) {
  const [restaurant, setRestaurant] = useState([]);
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hideReviews, setHideReviews] = useState(true);
  const [hideItems, setHideItems] = useState(true);
  const [hideForm, setHideForm] = useState(true);
  const [loginMessage, setLoginMessage] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [newRating, setNewRating] = useState(0);
  const editStars = true;

  const calculateNewRating = async(currentAverage, totalVotes, newVote) => {
    var currentTotal = 0;
    var newTotal = 0;
    var newTotalVotes = 0;
    var newAverage = 0;

    if (newVote !== null || newVote !== 0 ) {
        if (currentAverage === null) {
            currentAverage = 0;
        }
        if (totalVotes === null) {
            totalVotes = 0;
        }

        currentTotal = currentAverage * totalVotes;
        newTotal = currentTotal + newVote;
        newTotalVotes = totalVotes + 1;
        newAverage = Math.round(newTotal / newTotalVotes);

    } else {
        newAverage = currentAverage;
        newTotalVotes = restaurant.total;
    }

    await getCurrentUser();

    const restaurantData = {
      id: restaurantId,
      rating: newAverage,
      total: newTotalVotes,
      reviewed: false
    }

    await client.graphql({
     query: updateRestaurant,
     variables: { input: restaurantData }
    });

  }

  const handleCheckbox = async (event) => {
    if (event.target.checked === true) {
        setIsChecked(true);
        setUsername("anonymous");
    } else {
        setIsChecked(false);
        setUsername(tempName);
    }
  };

    const getName = (email) => {
        const name = email.substring(0, email.indexOf('@'));
        setUsername(name);
        setTempName(name);
    }

  const handleShowForm = async () => {
    try {
        const { signInDetails } = await getCurrentUser();
        getName(signInDetails.loginId);
    } catch {
        setLoginMessage(true);
        return;
    }
    setHideForm(false);
  }

  const closeForm = () => {
    setHideForm(true);
  }

  const handleNewRating = (r) => {
   setNewRating(r);
  }

  const submitReview = async (event) => {
       event.preventDefault();
       setReviewError('');

        try {
          calculateNewRating(restaurant.rating, restaurant.total, newRating);
          const reviewData = {
              restaurantID: restaurantId,
              restaurantName: restaurant.name,
              username: username,
              rating: newRating,
              message: message,
              approved: false
          }
          await client.graphql({
             query: createReview,
             variables: { input: reviewData },
          });

          closeForm();
          displayRestaurant();

        } catch (error) {

        }
  }

  const displayRestaurant = useCallback(async () => {
       try {
        setLoading(true);

        const response = await client.graphql({
          query: getRestaurant,
          variables: { id: restaurantId },
        });

        setRestaurant(response.data.getRestaurant);

        if (response.data.getRestaurant.items !== null || response.data.getRestaurant.items  === undefined) {
            setItems(Object.values(response.data.getRestaurant.items));
            setHideItems(false);
        }

        const variables = {
         filter: {
           restaurantID: {
             eq: restaurantId
           }
         }
        };

        const reviewData = await client.graphql({
          query: listReviews,
          variables: variables,
        });

        if (reviewData.data.listReviews.items.length !== 0) {
            setReviews(reviewData.data.listReviews.items);
            setHideReviews(false);
        }

        } catch (error) {

        } finally {
          setLoading(false);
        }
  }, [restaurantId]);

  useEffect(() => {
    displayRestaurant();
  }, [displayRestaurant]);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <section>
          <div className="mx-auto">
            <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {restaurant.name}
            </h2>
            <div className="border-2 border-white bg-white m-4 max-w-3xl mx-auto p-6 shadow-md rounded-lg">
             <div className="bg-white p-4 rounded-md items-center">
              <h2 className="mb-4 text-lg font-bold text-black">Contact Information</h2>
              <div className="flex flex-col">
                  <span className="text-black font-semibold text-sm">Website:</span>
                  <span className="mb-2 text-green-950 hover:text-green-900 text-sm">{restaurant.website}</span>
                  <span className="space-x-2 text-black font-semibold text-sm">Address: </span>
                  <span className="text-green-950 text-sm">{restaurant.address}</span>
              </div>
             </div>
            </div>
            { loading === true && (
                <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                    <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                    <div>Loading ...</div>
                </div>
            )}
            { hideItems === false && (
                <div className="mb-4 mx-auto p-6 bg-gray-50 rounded-lg">
                    <div className="px-4 sm:px-8 max-w-5xl m-auto">
                        <h1 className="mb-4 text-left font-bold text-lg">Vegan Items</h1>
                          {items?.map((item, index) => (
                           <ul key={index}>
                            <div className="border-2 border-gray-200 rounded-lg sahdow-lg justify-center items-center">
                              <li className="px-4 py-2 bg-white border-b last:border-none border-gray-200">{item}</li>
                           </div>
                          </ul>
                          ))}
                    </div>
                </div>
            )}
            <div className="mb-4 mx-auto p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-end px-4 sm:px-8 max-w-5xl m-auto">
                    <button
                     onClick={handleShowForm}
                     className="flex justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                    >
                        Add Review
                    </button>
                </div>
            </div>
            { !hideReviews ? (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                    {reviews?.map((review) => (
                      <div key={review.id} className="w-full bg-white rounded-lg shadow-lg p-12 flex flex-col justify-center items-center">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="mt-0.5 text-md text-gray-900 text-center">{review.username}</p>
                              <div className="flex justify-center gap-0.5">
                                  <Rating
                                    count={count}
                                    value={review.rating}
                                    size={size}
                                    activeColor={starColor}
                                    isHalf={isHalf}
                                    edit={edit}
                                  />
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">
                            {review.message}
                          </p>
                      </div>
                    ))}
                </div>
            ) : (
                <div className="mb-4 mx-auto p-6 bg-gray-50 rounded-lg">
                    <div className="px-4 sm:px-8 max-w-5xl m-auto">
                      <span className="rounded-lg bg-yellow-600 py-1 px-4 text-center text-white font-bold text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                        This restaurant has no reviews.
                      </span>
                    </div>
                </div>
            )}
            { loginMessage === true && (
                <div className="mb-4 mx-auto p-6 bg-gray-50 rounded-lg">
                    <div className="px-4 sm:px-8 max-w-5xl m-auto">
                      <span className="rounded-lg bg-yellow-600 py-1 px-4 text-center text-white font-bold text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                        Please login to leave a review.
                      </span>
                    </div>
                </div>
            )}
            { hideForm === false && (
                <div className="border-2 border-gray-200 bg-white m-4 max-w-4xl mx-auto p-6 border-gray-100 shadow-lg rounded-lg">
                  <form className="space-y-6">
                    <div>
                      <XMarkIcon className="w-3 h-3 flex ml-auto" onClick={closeForm}/>
                      {reviewError && <p className="mt-4 text-yellow-600 text-sm">{reviewError}</p>}
                      <div className="flex justify-center gap-0.5 text-green-500">
                        <Rating
                          initialRating={newRating}
                          count={count}
                          onChange={handleNewRating}
                          size={size}
                          activeColor={starColor}
                          isHalf={isHalf}
                          edit={editStars}
                        />
                      </div>
                        <div className="mt-2">
                          <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder={username}
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                            readOnly
                          />
                        </div>
                        <div className="mt-2 flex justify-end">
                          <input
                            id="default-checkbox"
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckbox}
                            className="w-4 h-4"
                          />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-green-950">
                          Post Anonymously
                        </label>
                        </div>
                      <div className="mt-2">
                        <textarea
                          id="message"
                          name="message"
                          type="text"
                          required
                          onChange={event => setMessage(event.target.value)}
                          className="p-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={submitReview}
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                      >
                        Post Review
                      </button>
                    </div>
                  </form>
                </div>
            )}
          </div>
        </section>
    </div>
  </>
  );
}

export default Details;
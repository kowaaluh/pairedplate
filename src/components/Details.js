import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant } from '../graphql/queries';
import { client } from "../graphql/client";
import Rating from 'react-rating-stars-component';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { createReview } from '../graphql/mutations';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from 'aws-amplify/auth';
import { baseUrl, size, count, starColor, isHalf, edit, bucket } from '../config/constants.js';
import { uploadData } from 'aws-amplify/storage';

function Details(props) {
  const [restaurant, setRestaurant] = useState([]);
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState(null);
  const [items, setItems] = useState(null);
  const [file, setFile] = useState(null);
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
  const displayHalf = false;

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("File uploaded:", uploadedFile);
    }
  };

  const handleCheckbox = async (event) => {
    if (event.target.checked === true) {
        setIsChecked(true);
        setUsername("anonymous");
    } else {
        setIsChecked(false);
        setUsername(tempName);
    }
  };

    const getName =  (email) => {
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
          const result = await uploadData({
            path: `${bucket}/image.png`,
            data: file,
          }).result;
          console.log(result);

          const reviewData = {
              restaurantID: restaurantId,
              username: username,
              rating: newRating,
              message: message,
              approved: false
          }
          const response = await client.graphql({
             query: createReview,
             variables: { input: reviewData }
          });
          console.log(response);


        } catch (error) {
            if (error.message === "Username/client id combination not found.") {
              console.log("You do not have an account, please sign up.");
            } else {
              console.log("An unexpected error occurred.");
            }
        }
  }

  useEffect(() => {
      const displayRestaurant = async () => {
           try {
            setLoading(true);

            const response = await client.graphql({
              query: getRestaurant,
              variables: { id: restaurantId }
            });

            setRestaurant(response.data.getRestaurant);

            if (response.data.getRestaurant.items !== null || response.data.getRestaurant.items  === undefined) {
                setItems(Object.values(response.data.getRestaurant.items));
                setHideItems(false);
            }

            if (response.data.getRestaurant.reviewed === true) {
                setReviews(Object.values(response.data.getRestaurant.reviews));
                setHideReviews(true);
                console.log("umm what");
            }

            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoading(false);
            }
      };
      displayRestaurant();

  }, [restaurantId]);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              {restaurant.name}
            </h2>
            <div className="border-2 border-gray-200 bg-yellow-600 m-4 max-w-2xl mx-auto p-6 shadow-md rounded-lg">
             <div className="bg-white p-4 rounded-md">
              <h2 className="mb-4 text-lg font-bold text-black">Contact Information</h2>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <span className="text-black font-semibold text-sm">website:</span>
                  <span className="text-green-950 hover:text-green-900 text-sm">{restaurant.website}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-black font-semibold text-sm">address: </span>
                  <span className="text-green-950 text-sm">{restaurant.address}</span>
                </div>
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
                  <div className="mb-4 sm:break-inside-avoid">
                    <blockquote className="rounded-lg bg-gray-50 p-6 shadow-sm sm:p-8">
                        {reviews?.map((review) => (
                          <div key={review.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex justify-center gap-0.5 text-green-500">
                                  <Rating
                                    count={count}
                                    value={review.rating}
                                    size={size}
                                    activeColor={starColor}
                                    isHalf={isHalf}
                                    edit={edit}
                                  />
                              </div>
                              <p className="mt-0.5 text-lg font-medium text-gray-900">{review.poster}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-gray-700">
                            {review.message}
                          </p>
                          </div>
                        ))}
                    </blockquote>
                  </div>
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
                <div className="border-2 border-gray-200 bg-white m-4 max-w-4xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
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
                          isHalf={displayHalf}
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
                        <input
                          id="message"
                          name="message"
                          type="text"
                          required
                          onChange={event => setMessage(event.target.value)}
                          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div>
                    {file && <p>Selected file: {file.name}</p>}
                    <div className="mt-2 mb-4 flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-100 border-dashed rounded-lg cursor-pointer bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listReviews, listRestaurants  } from '../graphql/queries';
import { client } from "../graphql/client";
import userIcon from '../assets/userIcon.png';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Rating from 'react-rating-stars-component';
import { baseUrl, size, count, starColor, isHalf, edit } from '../config/constants.js';
import { Link } from 'react-router-dom';

function UserProfile(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showError, setShowError] = useState(false);
  const [hideReviews, setHideReviews] = useState(true);

  useEffect(() =>
    {
        if ( props.isAuthenticated === false ){
            navigate('/');
        }

        const getData = async () => {
         try {
           setError("");
           setShowError(false);
           const response = await client.graphql({
              query: listReviews
           });

           setReviews(Object.values(response.data.listReviews.items));
           setHideReviews(false);

           setShowError(false);
           const variables = {
             filter: {
               rating: {
                 eq: 5
               }
            }
           };

          const restaurantData = await client.graphql({
            query: listRestaurants,
            variables: variables
          });
          setRestaurants(restaurantData.data.listRestaurants.items);

          } catch (error) {
            setError("You have no reviews");
            setShowError(true);
          } finally {
            setLoading(false);
          }
        };

        getData();

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
            <div className="mb-2 mx-auto p-6 bg-gray-50 rounded-lg">
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
                    <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {reviews?.map((review) => (
                          <div key={review.id} className="w-full border-2 border-gray-100 rounded-lg shadow-lg p-12 flex flex-col text-center">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="mt-0.5 text-md text-gray-900">{review.restaurantName}</p>
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
                  </>
                  )}
              </section>
            </div>
        )}
        <div className="flex justify-center items-center">
          <span className="rounded-lg bg-green-950 py-1 px-4 text-center text-white font-bold text-lg">
            See the latest 5 star restaurants...
          </span>
        </div>
            <div className="m-4 relative flex flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                        <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                        <div>Loading ...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {restaurants?.map((restaurant) => (
                          <div key={restaurant.id} className="w-full rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
                          style={{ backgroundImage: `url(${baseUrl}${restaurant.profilePic})`,
                           backgroundSize: "cover",
                           backgroundPosition: "center",
                           backgroundRepeat: "no-repeat",
                           alt: "restaurant logo"}}>
                              <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{restaurant.category}</div>
                                  <Link to={`/details/${restaurant.id}`}>
                                      <span className="text-center text-4xl font-bold text-white mb-2 items-center">
                                          {restaurant.name}
                                      </span>
                                  </Link>
                              </div>
                        ))}
                    </div>
                  )}
              </section>
            </div>
    </div>
  </>
  );
}

export default UserProfile;
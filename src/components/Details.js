import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getRestaurant } from '../graphql/queries';
import { client } from "../graphql/client";
import Rating from 'react-rating-stars-component';

function Details(props) {
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(true);
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState(null);
  const [items, setItems] = useState(null);
  const [hideReviews, setHideReviews] = useState([true]);
  const [hideItems, setHideItems] = useState([true]);

  useEffect(() => {
    {
      const displayRestaurant = async () => {
           try {
            setLoading(true);

            const response = await client.graphql({
              query: getRestaurant,
              variables: { id: restaurantId }
            });

            setRestaurant(response.data.getRestaurant);
            console.log(response.data.getRestaurant.reviews);

            if (response.data.getRestaurant.reviews !== null) {
              setReviews(response.data.getRestaurant.reviews);
              setHideReviews(false);
              console.log("reviews")
            }

            if (response.data.getRestaurant.items !== null) {
              setItems(response.data.getRestaurant.items);
              setHideItems(false);
              console.log("items");
            }

            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoading(false);
            }
      };
      displayRestaurant();
    }
  }, [restaurantId]);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <section className="bg-white">
          <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {restaurant.name}
            </h2>
            <div class="m-4 max-w-4xl mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div class="flex items-center space-x-8">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-600 font-semibold">website:</span>
                  <span class="text-blue-500 hover:text-blue-700">{restaurant.website}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-600 font-semibold">address: </span>
                  <span class="text-gray-700">{restaurant.address}</span>
                </div>
              </div>
            </div>
            { !hideReviews ? (
                <div className="mt-8 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
                  <div className="mb-8 sm:break-inside-avoid">
                    <blockquote className="rounded-lg bg-gray-50 p-6 shadow-sm sm:p-8">
                        {reviews.map((review) => (
                          <div key={review.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex justify-center gap-0.5 text-green-500">
                                  <Rating
                                    count={5}
                                    value={review.rating}
                                    size={30}
                                    activeColor="#ffd700"
                                    isHalf={true}
                                    edit={false}
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
          <p>The object is null or not valid</p>

            )}
          </div>
        </section>

    </div>
  </>
  );
}

export default Details;
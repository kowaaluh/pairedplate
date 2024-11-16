import React, { useEffect, useState } from 'react';
import banner from '../assets/banner.png';
import {Amplify} from 'aws-amplify';
import awsmobile from '../aws-exports';
import { listRestaurants } from '../graphql/queries';
import { client } from "../graphql/client";
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

Amplify.configure(awsmobile);

function Main() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const inputChange = (event) => {
    const str = event.target.value;
    if (str.length !== 0) {
        const upStr = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        setSearch(upStr);
    }
  };

  const findFood = async () => {
     try {
     setLoading(true);

     const variables = {
       filter: {
         state: {
           eq: search
         }
       }
     };

      const response = await client.graphql({
        query: listRestaurants,
        variables: variables,
      });

      setRestaurants(response.data.listRestaurants.items);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    const getRestaurants = async () => {
        try {
          const response = await client.graphql({
            query: listRestaurants
          });
          setRestaurants(response.data.listRestaurants.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getRestaurants();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <main className="flex-1 overflow-hidden p-0">
            <div className="bg-orange-100 flex justify-center items-center">
                <img
                  src={banner}
                  alt="Paired Plate"
                  className="w-full h-full object-fill"
                />
                <div className="absolute container max-w-full sm:max-w-4xl md:max-w-4xl lg:max-w-4xl xl:max-w-4xl p-6">
                    <form>
                        <div className="flex justify-center items-center">
                          <span className="rounded-lg bg-yellow-600 py-1 px-4 text-center text-white font-bold text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                            New restaurants added weekly
                          </span>
                        </div>
                        <h1 className="m-4 text-center font-bold text-3xl text-white">Get paired with foods that you can enjoy</h1>
                            <div className="bg-white rounded flex justify-center items-center">
                                <input
                                    className="bg-white rounded text-gray-400 outline-none p-2 focus:text-black w-full"
                                    type="search"
                                    name="search"
                                    onChange={inputChange}
                                    placeholder="Enter State"
                                />
                                <button
                                    onClick={() => findFood()}
                                    className="bg-white rounded text-white p-2"
                                    type="button"
                                >
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
                                </button>
                            </div>
                    </form>
                </div>
            </div>
            <div className="m-4 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                        <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                        <div>Loading ...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {restaurants.map((restaurant) => (
                          <div key={restaurant.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{restaurant.category}</div>
                          <span className="text-center font-bold text-2xl text-black mb-2">
                              {restaurant.name}
                          </span>
                          </div>
                        ))}
                    </div>
                  )}
              </section>
            </div>
        </main>
        <footer className="bg-green-950 pt-10 sm:mt-10 pt-10">
            <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Acronyms
                    </div>
                    <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        V - Vegan
                    </span>
                    <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        VEG - Vegetarian
                    </span>
                    <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        VO - Vegan and Vegetarian Options
                    </span>
                    <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        GF - Gluten Free
                    </span>
                    <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        GFO - Gluten Free Options
                    </span>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Socials
                    </div>
                    <a href="https://www.tiktok.com/@pairedplate" className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        TikTok
                    </a>
                    <a href="https://www.instagram.com/pairedplateapp/" className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        Instagram
                    </a>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-gray-400 font-medium mb-6">
                        Legal
                    </div>
                    <Link to="/privacy">
                        <span className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                            Privacy
                        </span>
                    </Link>
                </div>
            </div>
            <div className="pt-2">
                <div className="flex pb-5 px-3 m-auto pt-5
                    border-t border-gray-500 text-gray-400 text-xs
                    flex-col md:flex-row max-w-6xl">
                    <div className="mt-2">
                        © Copyright 2024 pairedplate.com. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}

export default Main;
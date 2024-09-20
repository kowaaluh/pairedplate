import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import {Amplify} from 'aws-amplify';
import awsExports from '../aws-exports';
import { listRestaurants } from '../graphql/queries';
import { client } from "../graphql/client";
import { Link } from 'react-router-dom';

Amplify.configure(awsExports);

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

  const goToSite = (url) => {
    window.location.href = url;
  }

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
        variables: variables
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
        <header className="bg-green-950 p-4 relative overflow-hidden">
            <img
              src={logo}
              alt="Paired Plate"
              className=" h-8 w-auto object-contain"
            />
        </header>
        <main className="flex-1 overflow-hidden p-0">
            <div class="bg-orange-100 flex justify-center items-center">
                <div class="container max-w-full sm:max-w-4xl md:max-w-4xl lg:max-w-4xl xl:max-w-4xl p-6">
                    <form>
                        <div className="flex justify-center items-center">
                          <span className="rounded-lg bg-yellow-600 py-1 px-4 text-center text-white font-bold text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
                            New restaurants added weekly
                          </span>
                        </div>
                        <h1 className="m-4 text-center font-bold text-3xl text-black">Get paired with foods that you can enjoy</h1>
                            <div className="flex justify-center items-center">
                                <input
                                    className="text-gray-400 outline-none p-2 focus:text-black"
                                    type="search"
                                    name="search"
                                    onChange={inputChange}
                                    placeholder="Enter State"
                                />
                                <button
                                    onClick={() => findFood()}
                                    className="bg-green-950 text-white rounded-r p-2"
                                    type="button"
                                >
                                    Search
                                </button>
                            </div>
                    </form>
                </div>
            </div>
            <div className="m-4 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                            <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                                <path clipRule='evenodd'
                                    d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                                    fill='currentColor' fillRule='evenodd' />
                            </svg>
                            <div>Loading ...</div>
                        </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {restaurants.map((restaurant) => (
                          <div key={restaurant.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                          <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{restaurant.category}</div>
                          <h2 className="text-center font-bold text-3xl text-black mb-2">
                              {restaurant.name}
                          </h2>
                          <div>
                            <div className="text-center text-sm text-black font-bold mb-2">{restaurant.address}</div>
                          </div>
                          <button onClick={() => goToSite(restaurant.website)} className="flex-grow-0 flex-shrink-0 bg-green-950 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none">
                            Website
                          </button>
                          </div>
                        ))}
                    </div>
                  )}
              </section>
            </div>
        </main>
        <footer class="bg-green-950 pt-10 sm:mt-10 pt-10">
            <div class="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
                <div class="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div class="text-xs uppercase text-gray-400 font-medium mb-6">
                        Symbols
                    </div>
                    <span class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        VO - Vegan and Vegetarian Options
                    </span>
                    <span class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        VEG - Vegetarian
                    </span>
                    <span class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        GFO - Gluten Free Options
                    </span>
                    <span class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        GF - Gluten Free
                    </span>
                </div>
                <div class="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div class="text-xs uppercase text-gray-400 font-medium mb-6">
                        Community
                    </div>
                    <a href="https://www.tiktok.com/@pairedplate" class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                        TikTok
                    </a>
                </div>
                <div class="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div class="text-xs uppercase text-gray-400 font-medium mb-6">
                        Legal
                    </div>
                    <Link to="/privacy">
                        <span class="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                            Privacy
                        </span>
                    </Link>
                </div>
            </div>
            <div class="pt-2">
                <div class="flex pb-5 px-3 m-auto pt-5
                    border-t border-gray-500 text-gray-400 text-xs
                    flex-col md:flex-row max-w-6xl">
                    <div class="mt-2">
                        © Copyright 2024 pairedplate.com. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
}

export default Main;
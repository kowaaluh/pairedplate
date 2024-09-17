import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import background from '../assets/background.png';
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
            <div className="m-4 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <div className="w-full max-w-4xl rounded-md border-2 border-gray-200 bg-white p-14" style={{ background: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="flex flex-col items-center ">
                  <span className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white">Restaurants added weekly</span>
                  <h3 className="mt-2 max-w-2xl text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl md:leading-tight">Want to find tasty food that meets your dietary needs?</h3>
                  <form action="" className="mx-auto mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0">
                    <input type="search" name="search" onChange={inputChange} className="grow rounded border-2 border-green-950 py-3 px-3 focus:border-green-950 focus:outline-none sm:rounded-l-md sm:rounded-r-none sm:border-r-0" placeholder="Enter State" />
                    <button onClick={() => findFood()} type="button" className="rounded bg-green-950 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md">Find Food</button>
                  </form>
                </div>
              </div>
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
                          <h2 className="text-center font-black text-center text-3xl text-black mb-2">
                              {restaurant.name}
                          </h2>
                          <div>
                            <div className="text-center text-sm text-black font-bold mb-2">{restaurant.address}</div>
                          </div>
                          <button onClick={() => goToSite(restaurant.website)} className="bg-green-950 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none">
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
                        VO - Vegan/Vegetarian Options
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
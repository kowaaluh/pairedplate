import React, { useEffect, useState } from 'react';
import banner from '../assets/banner.png';
import { listRestaurants } from '../graphql/queries';
import { client } from "../graphql/client";
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { baseUrl } from '../config/constants.js';

function Main() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const inputChange = (event) => {
    const str = event.target.value;
    setSearch(str);
  };

    const findByZipcode = async () => {
       try {
       setLoading(true);

       const variables = {
         filter: {
           zipcode: {
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
        } finally {
          setLoading(false);
        }
    };


    const findByCity = async () => {
       try {
       setLoading(true);

       const variables = {
         filter: {
           city: {
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
        } finally {
          setLoading(false);
        }
    };

  const findFood =  () => {
        if (search.length === 0) {
            getRestaurants();
        } else  if ((/^\d/.test(search))){
            findByZipcode();
        } else {
            const city = search.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            setSearch(city);
            findByCity();
        }
  };

  const getRestaurants = async () => {
      try {
        const response = await client.graphql({
          query: listRestaurants
        });
        setRestaurants(response.data.listRestaurants.items);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <div className="flex-1 overflow-hidden p-0 mb-0">
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
                        <h1 className="m-4 text-center font-bold text-3xl text-white">Get paired with plant-based foods</h1>
                            <div className="bg-white rounded flex justify-center items-center">
                                <input
                                    className="bg-white rounded text-gray-400 outline-none p-2 focus:text-black w-full"
                                    type="search"
                                    name="search"
                                    onChange={inputChange}
                                    placeholder="Enter City or Zipcode"
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
            <div className="m-4 relative flex-col items-center justify-center overflow-hidden p-8 sm:p-8 md:p-12 m-2 sm:m-4 md:m-6 lg:m-8">
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
                  {loading ? (
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                        <ArrowPathIcon className="w-6 h-6 animate-spin"/>
                        <div>Loading ...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {restaurants?.map((restaurant) => (
                          <div key={restaurant.id} className="w-full rounded-lg shadow-lg p-12 flex flex-col justify-center items-center"
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
    </div>
  );
}

export default Main;
import React, { useEffect, useState, useRef } from 'react';
import logo from './assets/logo.png';
import background from './assets/background.png';
import {Amplify} from 'aws-amplify';
import awsExports from './aws-exports';
import { listRestaurants } from './graphql/queries';
import { client } from "./graphql/client";

Amplify.configure(awsExports);

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [url, setUrl] = useState('');
  const [disabled, setDisabled] = useState(false);
  const alert = useRef(null);

  const scrollToSection = () => {
    if (alert.current) {
      alert.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleClick = (url) => {
    setModal(true);
    setUrl(url);
    setDisabled(true);
    scrollToSection();
  };

  const closeModal = () => {
    setModal(false);
    setDisabled(false);
  };

  const goToSite = () => {
    window.location.href = url;
  }

  const findFood = async (state) => {
     try {
      const response = await client.graphql({
        query: listRestaurants,
        variables: { state: state },
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
        <div ref={alert} className="m-4 relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 sm:p-12">
          <div className="w-full max-w-4xl rounded-md border-2 border-gray-200 bg-white p-14" style={{ background: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex flex-col items-center">
              <span className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white">50+ restaurants added this week</span>
              <h3 className="mt-2 max-w-2xl text-center text-2xl font-bold leading-tight sm:text-3xl md:text-4xl md:leading-tight">Want to find tasty food that meets your dietary needs?</h3>
              <form action="" className="mx-auto mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-0">
                <input type="search" name="search" id="search" className="grow rounded border-2 border-green-950 py-3 px-3 focus:border-green-950 focus:outline-none sm:rounded-l-md sm:rounded-r-none sm:border-r-0" placeholder="Enter State" />
                <button onClick={() => findFood()} type="submit" disabled={disabled} className="rounded bg-green-950 px-5 py-4 font-bold text-white sm:rounded-l-none sm:rounded-r-md">Find Food</button>
              </form>
            </div>
          </div>
            {modal && (
              <div className="max-w-lg mx-auto">
                  <div className="m-4 flex items-center justify-center">
                    <div className="w-96 rounded-xl p-5 border border-gray-200 bg-yellow-600">
                        <p className="text-center text-white font-bold  text-lg"> You are about to leave this site. Are you sure you want to continue? </p>
                        <div className="m-2 flex justify-center gap-4">
                            <button onClick={() => closeModal()} className="bg-green-950 text-white font-bold py-2 px-4 rounded focus:outline-none">
                              stay here
                            </button>
                            <button onClick={() =>goToSite()} className="bg-green-950 text-white font-bold py-2 px-4 rounded focus:outline-none">
                              continue
                            </button>
                        </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                          <svg fill='none' className="w-6 h-6 animate-spin" viewBox="0 0 32 32" xmlns='http://www.w3.org/2000/svg'>
                              <path clipRule='evenodd'
                                  d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
                                  fill='currentColor' fillRule='evenodd' />
                          </svg>
                        <div>Loading ...</div>
                    </div>
                  </div>
              </div>
            )}
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant.id} className="w-full border-2 border-gray-200 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center">
                      <div className="rounded-lg bg-yellow-600 py-px px-2 text-sm text-white mb-2">{restaurant.category}</div>
                      <h2 className="text-center font-black text-center text-3xl text-black mb-2">
                          {restaurant.name}
                      </h2>
                      <div>
                        <div className="text-center text-sm text-black font-bold mb-2">{restaurant.address}</div>
                      </div>
                      <button disabled={disabled} onClick={() => handleClick(restaurant.website)} className="bg-green-950 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none">
                        Menu
                      </button>
                      </div>
                    ))}
                </div>
              )}
          </section>
        </div>
    </div>
  );
}

export default App;

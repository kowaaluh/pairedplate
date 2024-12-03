import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

  return (
        <footer className="bg-white">
            <div className="max-w-6xl m-auto text-black-800 flex flex-wrap justify-left">
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-black font-medium mb-6">
                        Acronyms
                    </div>
                    <span className="my-3 block text-gray-600 text-sm font-medium duration-700">
                        V - Vegan
                    </span>
                    <span className="my-3 block text-gray-600 text-sm font-medium duration-700">
                        VO - Vegan Options
                    </span>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-black font-medium mb-6">
                        Socials
                    </div>
                    <a href="https://www.tiktok.com/@pairedplate" className="my-3 block text-gray-600 hover:text-gray-500 text-sm font-medium duration-700">
                        TikTok
                    </a>
                    <a href="https://www.instagram.com/pairedplateapp/" className="my-3 block text-gray-600 hover:text-gray-500 text-sm font-medium duration-700">
                        Instagram
                    </a>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-black font-medium mb-6">
                        Legal
                    </div>
                    <Link to="/privacy">
                        <span className="my-3 block text-gray-600 hover:text-gray-500 text-sm font-medium duration-700">
                            Privacy
                        </span>
                    </Link>
                    <Link to="/termsofservice">
                        <span className="my-3 block text-gray-600 hover:text-gray-500 text-sm font-medium duration-700">
                            Terms of Service
                        </span>
                    </Link>
                </div>
                <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
                    <div className="text-xs uppercase text-black font-medium mb-6">
                        Help
                    </div>
                    <Link to="/contactus">
                        <span className="my-3 block text-gray-600 hover:text-gray-500 text-sm font-medium duration-700">
                            Contact Us
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
  );
}

export default Footer;
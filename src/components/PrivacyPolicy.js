import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <div class="flex min-h-screen items-center justify-center">
            <div>
                <div class="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                    <div class="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                        <div class="p-6">
                            <h4 class="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            Privacy Policy
                            </h4>
                            <p class="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                Welcome to pairedplate.com. This Privacy Policy explains how we handle any personal data we may collect from you when you use our website.
                            </p>
                            <p class="font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                Information We Do Not Collect
                            </p>
                            <p class="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                We do not collect any personal information from users of our website. This means we do not gather data such as names, email addresses, or payment information. Additionally, we do not use cookies or other tracking technologies to monitor user behavior.
                            </p>
                            <p class="font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                Third-Party Services
                            </p>
                            <p class="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                               Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies for more information.
                            </p>
                            <p class="font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                               Changes to the Privacy Policy
                            </p>
                            <p class="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                                We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. Please review this policy periodically to stay informed of any changes.
                            </p>
                            <div class="flex justify-end ">
                                <Link to="/">
                                    <button
                                        type="button" className="rounded bg-green-950 px-5 py-4 font-bold text-white sm:rounded-l-md sm:rounded-r-md">
                                        Back to site
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}

export default PrivacyPolicy;
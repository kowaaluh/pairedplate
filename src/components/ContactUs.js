import React, { useState } from 'react';
import { createFeedback } from "../graphql/mutations";
import { client } from "../graphql/client";
import { Link } from 'react-router-dom';
import { Field, Label, Switch } from '@headlessui/react';

function ContactUs() {
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  function handleToggle (event) {
    if (event === true) {
        setAgreed(true);

    } else {
        setAgreed(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!isValidEmail(email)) {
        setEmail('');
    }
    if (!firstName) errors.firstName = 'First name is required';
    if (!email) errors.email = 'Email is required';
    if (!message) errors.message = 'Please leave us a message';
    if (!agreed) errors.error = 'Please agree to our privacy policy';
    return errors;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
        const inputDetails = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          message: message,
          read: false
        };

        await client.graphql({
          query: createFeedback,
          variables: { input: inputDetails }
        });

        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setFormErrors({});

    } catch (error) {
      setFormErrors(error.message);
    }
  };

  return (
    <>
        <div className="bg-gray-50 flex flex-col min-h-screen">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Contact Us
            </h2>
          </div>
          <div className="mb-8 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                {formErrors.error && <p className="mb-2 text-yellow-600 text-sm">{formErrors.error}</p>}
                <label htmlFor="first-name" className="block text-sm/6 text-gray-900">
                  First name
                  {formErrors.firstName && <p className="text-yellow-600 text-sm">{formErrors.firstName}</p>}
                </label>
                <div className="mt-2">
                  <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm/6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm/6 text-gray-900">
                  Email
                  {formErrors.email && <p className="text-yellow-600 text-sm">{formErrors.email}</p>}
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone-number" className="block text-sm/6 text-gray-900">
                  Phone number
                </label>
                <div className="relative mt-2.5">
                  <input
                    id="phone-number"
                    name="phone-number"
                    type="tel"
                    autoComplete="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm/6 text-gray-900">
                  Message
                  {formErrors.message && <p className="text-yellow-600 text-sm">{formErrors.message}</p>}
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm/6"
                    defaultValue={''}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <Field className="flex gap-x-4 sm:col-span-2">
                <div className="flex h-6 items-center">
                  <Switch
                    checked={agreed}
                    onChange={handleToggle}
                    className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800 data-[checked]:bg-green-800"
                  >
                    <span className="sr-only">Agree to policies</span>
                    <span
                      aria-hidden="true"
                      className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                    />
                  </Switch>
                </div>
                <Label className="text-sm/6 text-gray-600">
                  By selecting this, you agree to our{' '}
                  <Link to="/privacy" className="font-semibold text-green-950">
                    privacy&nbsp;policy
                  </Link>
                  .
                </Label>
              </Field>
              <div>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-green-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
}

export default ContactUs;
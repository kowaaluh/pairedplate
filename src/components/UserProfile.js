import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUser } from '../graphql/queries';
import { client } from "../graphql/client";

function UserProfile(props) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [email, setEmail] = useState('');
  useEffect(() => {
    {
        if (props.isAuthenticated !== true) {
            navigate('/');
        }
        const getUser = async () => {
            try {
              const response = await client.graphql({
                query: getUser,
                variables: {userId},
              });
              setEmail(response.data.getUser.email);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        getUser();
    }
  }, []);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <img class="w-32 h-32 rounded-full mx-auto" src="https://picsum.photos/200" alt="Profile picture"/>
        <h2 class="text-center text-2xl font-semibold mt-3">{email}</h2>
        <div class="flex justify-center mt-5">
          <a href="#" class="text-blue-500 hover:text-blue-700 mx-3">Twitter</a>
          <a href="#" class="text-blue-500 hover:text-blue-700 mx-3">LinkedIn</a>
          <a href="#" class="text-blue-500 hover:text-blue-700 mx-3">GitHub</a>
        </div>
        <div class="mt-5">
          <h3 class="text-xl font-semibold">Bio</h3>
          <p class="text-gray-600 mt-2">John is a software engineer with over 10 years of experience in developing web and mobile applications. He is skilled in JavaScript, React, and Node.js.</p>
        </div>
    </div>
  </>
  );
}

export default UserProfile;
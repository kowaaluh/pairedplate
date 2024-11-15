import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUser, listUsers } from '../graphql/queries';
import { client } from "../graphql/client";
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import {Amplify} from 'aws-amplify';
import awsmobile from '../aws-exports';

Amplify.configure({...awsmobile, aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"});

function UserProfile(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  useEffect(() => {
    {
        if ( props.isAuthenticated === false ){
            navigate('/');
        }
        const getUser = async () => {
         try {
          const { userId } = await getCurrentUser();
          const session = await fetchAuthSession();

          const variables = {
           filter: {
             owner: {
               eq: userId
             }
           }
          };

//          const token = session.tokens.idToken;
//          console.log(token);

          const response = await client.graphql({
            query: listUsers,
            variables: variables,
            authMode: 'AMAZON_COGNITO_USER_POOLS'
          });


            console.log("good", response);

          } catch (error) {
            console.error('Error fetching data:', error);
            //add back
//            navigate('/');
          }
        };
        getUser();
    }
  }, []);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">
        <img className="w-32 h-32 rounded-full mx-auto" src="https://picsum.photos/200" alt="Profile picture"/>
        <h2 className="text-center text-2xl font-semibold mt-3">Hi</h2>
        <div className="flex justify-center mt-5">
          <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">Twitter</a>
          <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">LinkedIn</a>
          <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">GitHub</a>
        </div>
        <div className="mt-5">
          <h3 className="text-xl font-semibold">Bio</h3>
          <p className="text-gray-600 mt-2">John is a software engineer with over 10 years of experience in developing web and mobile applications. He is skilled in JavaScript, React, and Node.js.</p>
        </div>
    </div>
  </>
  );
}

export default UserProfile;
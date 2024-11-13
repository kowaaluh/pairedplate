import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Details(props) {
  useEffect(() => {
    {
        if (props.isAuthenticated !== true) {
            return <Navigate to="/" />;
        }

    }
  }, []);

  return (
  <>
    <div className="bg-gray-50 flex flex-col min-h-screen">

    </div>
  </>
  );
}

export default Details;
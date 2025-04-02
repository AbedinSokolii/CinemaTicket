import React from 'react';
import background from './assets/Bacgroundlogin.jpg';
const Login = () => {
  return (

    <div className="flex justify-center items-center h-screen" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="bg-color_hover p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Login Here</h2>

        {/* Email Input */}
        <form className="max-w-sm mx-auto">
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
            </div>
            <a href='#' className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Register</a>

          </div>
          <button type="submit" className="text-white bg-color_button hover:bg-color_hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-color_button dark:hover:bg-color_hover dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

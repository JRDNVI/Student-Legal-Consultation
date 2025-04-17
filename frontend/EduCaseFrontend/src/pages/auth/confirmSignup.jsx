import { useState } from "react";
import { authApi } from "../../api/api";
import { Navigate, useNavigate } from "react-router-dom";

export default function ConfirmSignupPage() {
    const [confirmationCode, setConfirmationCode] = useState("");
    const [username, setUsername] = useState("");
    const Navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await authApi.post("/auth/confirm_signup", {
            username,
            code: confirmationCode,
          });
            Navigate("/login")
        } catch (err) {
          alert(err.response?.data?.message || err.message);
        }
      };      

      //Current Design is from https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms
      return (
        <>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="mx-auto h-10 w-auto"
              />
              <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                Confirm your signup
              </h2>
            </div>
      
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>
      
                <div>
                  <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-900">
                    Confirmation Code
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmationCode"
                      name="confirmationCode"
                      type="text"
                      required
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      placeholder="Enter your confirmation code"
                    />
                  </div>
                </div>
      
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      );
}

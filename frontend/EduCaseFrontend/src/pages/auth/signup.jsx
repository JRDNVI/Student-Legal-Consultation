import { useState } from "react";
import api from "../../api/api";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await api.post("/auth/signup", {
          username,
          password,
          email,
          role,
        });
  
        const data = response.data;
  
        alert("Signup successful! Please confirm your email.");
        window.location.href = "/confirmSignup";
      } catch (err) {
        alert(`Signup failed: ${err.response?.data?.message || err.message}`);
      }
    };
     // Current Design is from https://tailwindcss.com/plus/ui-blocks/application-ui/forms/sign-in-forms
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
                Create your account
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
      
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
      
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                    Role
                  </label>
                  <div className="mt-2">
                    <select
                      id="role"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    >
                      <option value="">Select your role</option>
                      <option value="student">Student</option>
                      <option value="solicitor">Solicitor</option>
                      <option value="client">Client</option>
                      <option value="mentor">Mentor</option>
                    </select>
                  </div>
                </div>
      
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      );      

}
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Signup = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await signup(
      formData.username,
      formData.email,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Or{" "}
            <button
              onClick={onToggleMode}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              sign in to your existing account
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-center text-red-600">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

// SignupFormTailwind.tsx
"use client";
import React from "react";

const formFields = [
  { id: "firstname", label: "First Name", type: "text", placeholder: "Tyler" },
  { id: "lastname", label: "Last Name", type: "text", placeholder: "Durden" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
  { id: "twitterpassword", label: "Twitter Password", type: "password", placeholder: "••••••••" },
];

const FormTailwind = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(Object.fromEntries(data.entries()));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Welcome to Aceternity</h2>
      <p className="text-sm text-gray-500 mt-1 dark:text-gray-300">
        Login to aceternity if you can because we don&apos;t have a login flow yet.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {formFields.map(({ id, label, type, placeholder }) => (
          <div key={id} className="flex flex-col space-y-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              placeholder={placeholder}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>
        ))}


        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign up →
        </button>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-2">
          <OAuthButton label="GitHub" />
          <OAuthButton label="Google" />
          <OAuthButton label="OnlyFans" />
        </div>
      </form>
    </div>
  );
}

export default FormTailwind;


function OAuthButton({ label }) {
  return (
    <button
      type="button"
      className="w-full border border-gray-300 dark:border-gray-700 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <span className="text-sm text-gray-800 dark:text-gray-200">
        Continue with {label}
      </span>
    </button>
  );
}

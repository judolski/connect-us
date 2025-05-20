"use client";

import api from "@/lib/axios";
import { useEffect, useState } from "react";

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  [key: string]: string;
};

export default function UserForm() {
  const [isClient, setIsClent] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClent(true);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await api.post("/api/new-user", formData);

      const { success, data, message } = res.data;

      if (success) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
      } else {
        setError(message);
        // throw new Error("Submission failed");
      }
    } catch (err) {
      setError(err as string | null);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    isClient && (
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phoneNumber", type: "tel" },
          { label: "Password", name: "password", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3257A9] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-[#304ea9]">
          {loading ? "Submitting..." : "Create Account"}
        </button>

        {success && (
          <p className="text-green-600 text-center text-sm mt-2">
            ✅ User created successfully!
          </p>
        )}
        {error !== null && (
          <p className="text-red-600 text-center text-sm mt-2">❌ {error}</p>
        )}
      </form>
    )
  );
}

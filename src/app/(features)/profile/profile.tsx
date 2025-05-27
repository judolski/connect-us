"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, User2, Pencil } from "lucide-react";
import api from "@/lib/axios";
import { IUser } from "@/types/user";
import Loader from "@/components/loader";

function getInitials(firstName: string, lastName: string) {
  return (
    (firstName?.[0] || "").toUpperCase() + (lastName?.[0] || "").toUpperCase()
  );
}

const UserProfile = () => {
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState({
    firstName: "",
    lastName: "",
  });
  const [profile, setProfile] = useState<IUser>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    status: "active",
    createdAt: "",
  });

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    api.get("/api/users/profile").then((res) => {
      setLoading(false);
      if (res.data.success) {
        const { data } = res.data;
        setProfile(data);
        setProfileName({ firstName: data.firstName, lastName: data.lastName });
        setEditing(false);
      } else {
        console.error("Failed to fetch profile:", res.data.message);
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);

  const handleSave = () => {
    api.put("/api/users/profile", profile).then((res) => {
      if (res.data.success) {
        const { data } = res.data;
        setProfile(data);
        setProfileName({ firstName: data.firstName, lastName: data.lastName });
        setEditing(false);
      } else {
        console.error("Failed to update profile:", res.data.message);
      }
    });
  };

  return loading ? (
    <Loader type="profile" />
  ) : (
    mounted && (
      <div className="w-full h-[98vh] sm:h-[90vh] overflow-y-auto p-4 shadow-lg rounded-md">
        <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6 items-center p-6 ">
          {/* Avatar */}
          <div className="flex flex-col w-full items-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 border-4 border-white shadow-lg flex items-center justify-center text-5xl text-white font-bold mb-3 select-none">
              {getInitials(profileName.firstName, profileName.lastName)}
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <User2 className="w-5 h-5 text-indigo-400" />
              {profileName.firstName} {profileName.lastName}
            </div>
            {!editing && (
              <button
                onClick={handleEdit}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2 shadow-lg transition-all"
                aria-label="Edit Profile">
                <Pencil size={22} />
              </button>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-5 w-full">
            <div className="space-y-5 w-full overflow-y-auto max-h-[calc(100%-200px)] px-1">
              <div className="space-y-5 w-full">
                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    First Name
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border-0 border-b border-gray-200 text-lg bg-transparent outline-none py-1 text-gray-900 disabled:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    Last Name
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border-0 border-b border-gray-200 text-lg bg-transparent outline-none py-1 text-gray-900 disabled:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    Email
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full border-0 border-b border-gray-200 text-lg bg-transparent outline-none py-1 text-gray-900 disabled:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    <input
                      type="phoneNumber"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      disabled={true}
                      className="w-full border-0 border-b border-gray-200 text-lg bg-transparent outline-none py-1 text-gray-900 disabled:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        profile.status === "active"
                          ? "bg-green-500"
                          : "bg-red-400"
                      }`}></span>
                    <span
                      className={`font-medium text-base ${
                        profile.status === "active"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                      {profile.status.charAt(0).toUpperCase() +
                        profile.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-xs">
                    Joined
                  </label>
                  <div className="text-base text-gray-700 mt-1">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                {editing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className={`rounded-full px-6 py-2 font-semibold text-base mt-2 shadow transition-colors duration-200 ${"bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"}`}>
                      {"Save"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserProfile;

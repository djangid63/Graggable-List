import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import baseurl from '../BaseUrl'
import { getAuthHeaders } from '../utils/authHeaders'

const NavBar = () => {
  const count = useSelector((state) => state.counter.value)

  const [menuOpen, setMenuOpen] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)

  const dropdownRef = useRef(null)
  const userEmail = localStorage.getItem("email")

  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    email: userEmail || ''
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    email: userEmail || ''
  })


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(`${baseurl}/user/update-profile`, profileData, getAuthHeaders())
      alert(res.data.message)
      setEditModal(false)
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile")
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handlePasswordReset = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/reset-password`, passwordData, getAuthHeaders())
      alert(res.data.message)
      setPasswordModal(false)
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password")
    }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white font-bold text-xl">Trello</div>

        <div className="flex items-center gap-4">
          <div ref={dropdownRef} className="relative">
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg w-48 z-10 overflow-hidden border border-purple-100">
                <button
                  onClick={() => { setEditModal(true); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition text-purple-700 border-b border-purple-50"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => { setPasswordModal(true); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition text-purple-700 border-b border-purple-50"
                >
                  Reset Password
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-purple-50 transition text-purple-700"
                >
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-purple-600">Edit Profile</h3>

            <div className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full border border-purple-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />

              <input
                name="age"
                placeholder="Age"
                value={profileData.age}
                onChange={handleProfileChange}
                className="w-full border border-purple-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />

              <input
                type="email"
                value={profileData.email}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-purple-600">Reset Password</h3>

            <div className="space-y-4">
              <input
                type="email"
                value={passwordData.email}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl"
              />

              <input
                type="password"
                name="oldPassword"
                placeholder="Current Password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full border border-purple-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-purple-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setPasswordModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition shadow-md"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar

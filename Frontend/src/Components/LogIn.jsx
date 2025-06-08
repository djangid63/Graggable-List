import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseurl from '../BaseUrl'

const LogIn = () => {
  const [formdata, setformdata] = useState({
    email: "",
    password: ""
  })

  const navi = useNavigate()

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(formdata.email, formdata.password)

    senddata()
    setformdata({
      email: "",
      password: ""
    })
  }

  const senddata = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/logindata`, formdata)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', res.data.email)
      alert(res.data.message)
      navi('/main')
    } catch (error) {
      const val = error.response?.data?.message
      alert(val)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm border-t-4 border-purple-500">
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Welcome Back</h2>

        <div className="mb-5">
          <label className="block mb-2 text-purple-700 font-medium">Email</label>
          <input
            type="email"
            name='email'
            placeholder="Enter your email"
            value={formdata.email}
            onChange={handleChange}
            className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-purple-700 font-medium">Password</label>
          <input
            type="password"
            name='password'
            placeholder="Enter your password"
            value={formdata.password}
            onChange={handleChange}
            className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:opacity-90 transform hover:-translate-y-1 transition duration-300 shadow-md mb-6"
        >
          Log In
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/" className="text-pink-500 font-medium hover:text-purple-600 transition">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LogIn

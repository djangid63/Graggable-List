import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseurl from '../BaseUrl'


const SignUp = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: ""
  })

  const navi = useNavigate()

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value })
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    console.log(formdata.name, formdata.email, formdata.password, formdata.age, formdata.gender)

    sendingdata()
    setformdata({
      name: "",
      email: "",
      password: "",
      age: "",
      gender: ""
    });
  }

  const sendingdata = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/senddata`, formdata)
      alert(res.data.message)
      localStorage.setItem('email', formdata.email)
      navi('/otp')
    } catch (error) {
      const res = (error.response?.data?.message)
      alert(res)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-blue-100 to-indigo-100">
      <form onSubmit={handlesubmit} className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border-t-4 border-teal-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">Create Account</h2>

        <div className="mb-4">
          <label className="block mb-2 text-teal-700 font-medium">Name</label>
          <input
            type="text"
            name='name'
            placeholder="Enter your name"
            value={formdata.name}
            onChange={handleChange}
            className="w-full border border-blue-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-teal-700 font-medium">Email</label>
          <input
            type="email"
            name='email'
            placeholder="Enter your email"
            value={formdata.email}
            onChange={handleChange}
            className="w-full border border-blue-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-teal-700 font-medium">Password</label>
          <input
            type="password"
            name='password'
            placeholder="Create a password"
            value={formdata.password}
            onChange={handleChange}
            className="w-full border border-blue-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-teal-700 font-medium">Age</label>
          <input
            type="number"
            name='age'
            placeholder="Enter your age"
            value={formdata.age}
            onChange={handleChange}
            className="w-full border border-blue-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-teal-700 font-medium">Gender</label>
          <select
            value={formdata.gender}
            onChange={handleChange}
            name='gender'
            className="w-full border border-blue-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition bg-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white p-3 rounded-xl hover:opacity-90 transform hover:-translate-y-1 transition duration-300 shadow-md mb-6"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-medium hover:text-teal-600 transition">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp

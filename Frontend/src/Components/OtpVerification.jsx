import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router'
import baseurl from '../BaseUrl'

const OtpVerification = () => {

  const [data, setdata] = useState("")

  const navi = useNavigate()

  const handlesubmit = (e) => {
    e.preventDefault()

    otpcheck()
    setdata("")
  }

  const email = localStorage.getItem('email')

  const otpcheck = async () => {
    try {
      const res = await axios.post(`${baseurl}/user/otpverify`, { email, otp: data })
      alert(res.data.message)
      navi('/login')
    } catch (error) {
      const re = error.response?.data?.message
      alert(re)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm border-t-4 border-amber-500 relative">
        <div className="h-16 w-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center mb-3 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handlesubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={data}
              onChange={(e) => setdata(e.target.value)}
              className="w-full border border-amber-200 p-4 rounded-xl text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl hover:opacity-90 transform hover:-translate-y-1 transition duration-300 shadow-md"
          >
            Verify Now
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">Didn't receive code? <span className="text-orange-500 cursor-pointer font-medium">Resend</span></p>
        </div>
      </div>
    </div>
  )
}

export default OtpVerification

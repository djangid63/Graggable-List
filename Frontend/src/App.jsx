import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import SignUp from './Components/SignUp'
import LogIn from './Components/LogIn'
import Main from './Components/Main'
import NavBar from './Components/NavBar'
import OtpVerification from './Components/OtpVerification'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp/>} />
        <Route path='/login' element={<LogIn/>} />
        <Route path='/otp' element={<OtpVerification/>} />
        <Route path='/main' element={<><NavBar/><Main/></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

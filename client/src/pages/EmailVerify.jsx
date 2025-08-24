import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl, isLoggedIn, setIsLoggedIn, userData, getUserData } = useContext(AppContent);
    const navigate = useNavigate();
    const inputRef = useRef([]);
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length-1) {
            inputRef.current[index+1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputRef.current[index-1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split("");
        pasteArray.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char;
            }
        });
    }

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const otpArray = inputRef.current.map(e => e.value);
            const otp = otpArray.join("");
            const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});

            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate('/');
    }, [isLoggedIn, userData])

    return (
        <div  className="flex flex-col items-center justify-center min-h-screen bg-[linear-gradient(to_bottom,#bdc3c7,#2c3e50)]">
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <form onSubmit={submitHandler} className='bg-slate-900 p-10 rounded-lg shadow-lg w-[90%] sm:w-96 text-indigo-300 text-sm'>
                <h1 className='text-white text-3xl font-semibold text-center mb-4'>Verify OTP</h1>
                <p className='text-center text-xl mb-6 text-indigo-200'>Enter the 6-digit code sent to your email.</p>
                <div className='flex justify-between mb-6' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input className="w-12 h-12 bg-slate-600 text-white text-center text-xl rounded-md" type="text" maxLength='1' key={index} ref={e=> inputRef.current[index]=e} onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)} required />
                    ))}
                </div>
                <button className='w-full py-3 bg-gradient-to-r from-indigo-400 to-indigo-900 text-white rounded-full '>Verify Email</button>
            </form>
        </div>
    )
}

export default EmailVerify;
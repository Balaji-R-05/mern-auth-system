import React, { useState, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router'

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const inputRef = useRef([]);
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputRef.current[index - 1].focus();
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(to_bottom,#bdc3c7,#2c3e50)]">
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <form className='bg-slate-900 p-10 rounded-lg shadow-lg w-[90%] sm:w-96 text-indigo-300 text-sm'>
                <h1 className='text-white text-3xl font-semibold text-center mb-4'>Reset Password</h1>
                <p className='text-center text-xl mb-6 text-indigo-200'>Enter your registered email</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-700'>
                    <img src={assets.mail_icon} alt="" />
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" placeholder="Email Id" className='bg-transparent outline-none text-white' required />
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 text-white font-medium'>Send OTP</button>
            </form>

            <form onSubmit='' className='bg-slate-900 p-10 rounded-lg shadow-lg w-[90%] sm:w-96 text-indigo-300 text-sm'>
                <h1 className='text-white text-3xl font-semibold text-center mb-4'>Reset OTP</h1>
                <p className='text-center text-xl mb-6 text-indigo-200'>Enter the 6-digit code sent to your email.</p>
                <div className='flex justify-between mb-6' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input className="w-12 h-12 bg-slate-600 text-white text-center text-xl rounded-md" type="text" maxLength='1' key={index} ref={e => inputRef.current[index] = e} onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)} required />
                    ))}
                </div>
                <button className='w-full py-3 bg-gradient-to-r from-indigo-400 to-indigo-900 text-white rounded-full '>Submit</button>
            </form>

            <form className='bg-slate-900 p-10 rounded-lg shadow-lg w-[90%] sm:w-96 text-indigo-300 text-sm'>
                <h1 className='text-white text-3xl font-semibold text-center mb-4'>Enter New Password</h1>
                <p className='text-center text-xl mb-6 text-indigo-200'>Enter your new password</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-slate-700'>
                    <img src={assets.lock_icon} alt="" />
                    <input
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        type="password" placeholder="New Password" className='bg-transparent outline-none text-white' required />
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 text-white font-medium'>Set new password</button>
            </form>
        </div>
    )
}

export default ResetPassword;
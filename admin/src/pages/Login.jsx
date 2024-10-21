import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
const Login = () => {

    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)
    // console.log('bac', backendUrl);


    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token); // Save the token in context
                    toast.success('Login Successful');
                } else {
                    toast.error(data.message);
                }

            } else {
                const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    console.log(data.token);

                    toast.success('Login Successful');
                } else {
                    toast.error(data.message);
                }

            }
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto item-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
                <p className='text-2xl font-semibold text-blue-600 m-auto'><span className='text-black'>{state}</span> Login</p>
                <div className='w-full'>
                    <p>Login</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#dadada] rounded w-full p-2 mt-1' type="email" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#dadada] rounded w-full p-2 mt-1' type="password" required />
                </div>
                <button className='bg-blue-600 text-white w-full py-2 rounded text-base'>Login</button>
                {
                    state === 'Admin'
                        ? <p className='text-black'>Doctor Login ? <span className='text-blue-600 cursor-pointer underline' onClick={() => setState('Doctor')}>Click Here</span></p>
                        : <p className='text-black'>Admin Login ? <span className='text-blue-600 cursor-pointer underline' onClick={() => setState('Admin')}>Click Here</span></p>
                }
            </div>
        </form>
    )
}

export default Login
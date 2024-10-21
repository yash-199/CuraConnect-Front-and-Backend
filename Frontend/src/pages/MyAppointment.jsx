import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const MyAppointment = () => {
    // const { doctors } = useContext(AppContext)

    const { backendUrl, token, getDoctorsData } = useContext(AppContext)

    const [appointment, setAppointment] = useState([])
    const months = ["", "Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const navigate = useNavigate()
    const slotDateFormat = (slotDate) => {
        const dateArry = slotDate.split('_')
        return dateArry[0] + "" + months[Number(dateArry[1])] + " " + dateArry[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            if (data.success) {
                setAppointment(data.appointment.reverse())
                console.log(data.appointment); // 'appointments' does not exist because the backend sends 'appointment' (singular)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
        // 11:05:43
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            // console.log(appointmentId);
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointments', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message);
                getUserAppointments()
                getDoctorsData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: 'Appointment Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log('Razorpay response:', response); // Log to ensure razorpay_order_id is present

                try {
                    const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } });
                    if (data.success) {
                        getUserAppointments();  // Fetch updated appointments
                        navigate('/my-appointment');  // Redirect to appointments page
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }

        };

        const rzp = new window.Razorpay(options);  // Fixed typo here
        rzp.open();
    };


    const appointmentRazorPay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay',
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                console.log(data.order);
                initPay(data.order)
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Request failed:', error.message);
        }
    };


    useEffect(() => {
        if (token)
            getUserAppointments()
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
            <div>
                {appointment.length > 0 ? (
                    appointment.map((item, index) => (
                        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                            <div>
                                <img
                                    className='w-32 bg-indigo-50'
                                    src={item.docData.image} // Access image from `item.docData`
                                    alt={item.docData.name} // Use doctor's name for alt attribute
                                />
                            </div>
                            <div className='flex-1 text-sm text-zinc-600'>
                                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                                <p>{item.docData.speciality}</p>
                                <p>{item.docData.gender}</p>
                                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                                <p className='text-xs'>{item.docData.address}</p>
                                <p className='text-xs mt-1'>
                                    <span className='text-sm text-neutral-700 font-medium'>Date & Time</span> : {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>
                            </div>
                            <div></div>
                            <div className='flex flex-col gap-2 justify-end'>
                                {/* {!item.cancelled && !item.payment && !item.isCompleted &&<button className='sm:min-48 py-2 border rounded text-stone-100 bg-indigo-100'>Paid</button>} */}
                                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appointmentRazorPay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-3 border hover:bg-primary hover:text-white transition-all duration-300'>
                                    Pay Online
                                </button>

                                }
                                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-3 border hover:bg-red-600 hover:text-white transition-all duration-300'>
                                    Cancel Appointment
                                </button>}
                                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-zinc-600 mt-4">No appointments booked.</p>
                )}
            </div>

        </div >
    )
}

export default MyAppointment
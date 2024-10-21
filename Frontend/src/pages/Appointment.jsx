import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../context/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    // Extracting the doctor ID from the route parameters
    const { docId } = useParams();

    // Using the context to get the list of doctors and currency symbol
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);

    // Days of the week used for displaying the available slots
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const navigate = useNavigate()


    // State to store selected doctor information
    const [docInfo, setDocInfo] = useState(null);

    // State to store available time slots for the doctor
    const [docSlots, setDocSlots] = useState([]);

    // State to track the currently selected slot index
    const [slotIndex, setSlotIndex] = useState(0);

    // State to track the selected time slot (not used yet, but will store selected time)
    const [slotTime, setSlotTime] = useState('');

    // Fetch doctor information based on the docId from the doctors array in context
    const fetchDocInfo = () => {
        const docInfo = doctors.find(doc => doc._id === docId);
        setDocInfo(docInfo); // Set the selected doctor's information in state
    };

    // UseEffect hook to run fetchDocInfo whenever the list of doctors or docId changes
    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    // Function to calculate and set available appointment slots for the doctor
    const getAvailableSlots = () => {
        // Clear previous slots
        setDocSlots([]);

        // Get the current date
        let today = new Date();

        // Loop through the next 7 days to generate slots for each day
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i); // Set current date to today + i (next 7 days)

            // Setting the end time for appointments (9 PM of the same day)
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0); // Appointments end at 9 PM

            // For today's date, check the current hour and set the first available slot accordingly
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                // For future days, set the first slot at 10:00 AM
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = []; // Array to store time slots for each day

            // Loop to create 30-minute slots until the end of the day (9 PM)
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;
                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate), // Store full date and time
                        time: formattedTime, // Store only the formatted time string
                    });

                }

                // Increment the current time by 30 minutes for the next slot
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            // Add the slots for this day to the list of all slots
            setDocSlots(prev => [...prev, timeSlots]);
        }
    };

    // UseEffect hook to calculate available slots when doctor info is fetched
    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);


    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book Appointment');
            return navigate('/login')
        }
        try {
            // Get the date of the selected slot
            const date = docSlots[slotIndex][0].datetime;

            // Extract day, month, and year
            let day = date.getDate();
            let month = date.getMonth() + 1; // getMonth() is zero-based, so add 1
            let year = date.getFullYear();   // Correct method to get the year

            // Format the date as day_month_year
            const slotDate = `${day}_${month}_${year}`;

            // Logging the slotDate to the console
            // console.log(slotDate);

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)

        }
    }

    // Render doctor information and available appointment slots
    return docInfo && (
        <div>
            {/* Doctor Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                {/* Doctor's Image */}
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* Doctor's Name, Degree, and Experience */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>
                            {docInfo.degree} - {docInfo.speciality}
                        </p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {docInfo.experience}
                        </button>
                    </div>
                    {/* Doctor's About Section */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About
                            <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                            {docInfo.about}
                        </p>
                    </div>
                    {/* Doctor's Appointment Fee */}
                    <p className='text-gray-500 font-semibold mt-4'>
                        Appointment Fee: <span className='text-gray-500'>{currencySymbol} {docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-3 font-medium text-gray-700'>
                <p>Booking Slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {/* Loop through the available slots and render them */}
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <div
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-400'}`}
                            key={index}
                            onClick={() => setSlotIndex(index)} // Handle slot selection
                        >
                            {/* Display the day of the week and the date for each slot */}
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-200'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-6'>Book an Appointment</button>
            </div>

            {/* listing related doctors */}
            {/* <RelatedDoctors docId={docId} speciality={docInfo.speciality} /> */}
        </div>
    );
};

export default Appointment;

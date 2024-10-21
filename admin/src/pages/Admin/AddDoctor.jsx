import { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Years');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setspeciality] = useState('General Physician');
    const [degree, setDegree] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('Male');

    const { backendUrl, atoken } = useContext(AdminContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!docImg) {
                return toast.error('Image not Selected')
            }


            const formData = new FormData();
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('gender', gender)
            formData.append('degree', degree)
            formData.append('address', address)


            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`);

            })

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { atoken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setAbout('')
                setAddress('')
                setDegree('')
                setEmail('')
                setExperience('')
                setFees('')
                setGender('')
                setPassword('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }



    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Upload Area" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
                    <p className='text-sm'>Upload Doctor<br />Picture</p>
                </div>

                {/* Ensure both sides have equal width */}
                <div className='flex flex-col lg:flex-row gap-10 text-gray-600'>

                    {/* Left side */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Doctor Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={(email)} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="email" placeholder='Doctor Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="password" placeholder='Doctor Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="7 Years">7 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10 Years">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="number" placeholder='Doctor Fees' required />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setspeciality(e.target.value)} value={speciality} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value="General Physician">General Physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Gender</p>
                            <select onChange={(e) => setGender(e.target.value)} value={gender} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Doctor Education' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress(e.target.value)} value={address} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder='Address' required />
                        </div>
                    </div>
                </div>

                <div className='mt-4 mb-2'>
                    <p>About</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' placeholder='Write About Doctor' rows={5} required />
                </div>

                <button className=' bg-blue-500 text-white px-10 py-3 mt-4 rounded-full hover:bg-blue-600 transition duration-200'>
                    Add Doctor
                </button>
            </div>
        </form>


    )
}

export default AddDoctor
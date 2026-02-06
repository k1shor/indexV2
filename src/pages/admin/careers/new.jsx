'use client';
import { addCareer } from '@/pages/api/careerAPI';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const AddCareer = () => {
    const [formData, setFormData] = useState({})
    let [error, setError] = useState('')
    let [success, setSuccess] = useState(false)

    let router = useRouter()
    let { career_title, vacancyNumber, offered_salary, job_description, qualification, posted_date, deadline } = formData

    let token
    useEffect(() => {
        token = localStorage.getItem('token')

    },[success])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // posted_date = new Date(posted_date)
    // let yy = posted_date.getFullYear()
    // let mm = posted_date.getMonth().toString().padStart(2, '0')
    // let dd = posted_date.getDate().toString().padStart(2, '0')
    // posted_date = yy + "-" + mm + '-' + dd

    // deadline = new Date(deadline)
    // yy = deadline.getFullYear()
    // mm = deadline.getMonth().toString().padStart(2, '0')
    // dd = deadline.getDate().toString().padStart(2, '0')
    // deadline = yy + "-" + mm + '-' + dd

    // let today = new Date()
    // yy = today.getFullYear()
    // mm = today.getMonth().toString().padStart(2, '0')
    // dd = today.getDate().toString().padStart(2, '0')
    // today = yy + "-" + mm + '-' + dd

    var today = new Date()
    var day = String(today.getDate()).padStart(2, 0)
    var month = String(today.getMonth() + 1).padStart(2, 0)
    var year = today.getFullYear()
    today = year+ "-" + month + "-" + day

    const handleSubmit = (event) => {
        event.preventDefault()
        addCareer(formData, token)
            .then(data => {
                if (data.error) {
                    setSuccess(false)
                    console.log(data.error)
                    setError(data.error)
                }
                else {
                    setError('')
                    setSuccess(true)
                    console.log("career added")
                    setFormData({
                        career_title: "",
                        vacancyNumber: "",
                        offered_salary: "",
                        job_description: "",
                        qualification: "",
                        posted_date: "",
                        deadline: ""
                    })
                }
            })
            .catch(error => console.log(error))
    }

    const showError = () => {
        if (error) {
            Swal.fire({
                icon: "error",
                toast: true,
                title: "error",
                text: error,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                color: "#d33"
            })
            setError('')
            return <div>{error}</div>
        }
    }
    const showSuccess = () => {
        if (success) {
            Swal.fire({
                icon: "success",
                toast: true,
                title: "success",
                text: 'Career added successfully.',
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                color: "#64DD17"
            })
            setSuccess('')
            return router.push('/admin/careers')
        }


        // const validate = (values) =>{
        //     const errors ={}
        //     if(!values.posted_date){
        //         errors.posted_date = 
        //     }
        // }
    }


    return (
        <div className='bg-blue-200'>
            {showError()}
            {showSuccess()}
            <form className='border-2 shadow-lg bg-white rounded-md mb-10 ms-7 lg:w-3/5 md:w-5/6 w-10/12 xl:p-10 md:p-5 p-2'>
                <h1 className='font-bold lg:text-3xl lg:text-left text-center md:text-2xl'>Add Career</h1>
                            <label className=' md:text-lg text-sm'>Career Title:</label>
                            <input type="text" name="career_title" value={career_title} className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' onChange={handleChange} />

                            <label className='md:text-lg text-sm'>Vacancy Number:</label>
                            <input type="text" name="vacancyNumber" value={vacancyNumber} className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' onChange={handleChange} />

                            <label className='md:text-lg'>Offered Salary:</label>
                            <input type="text" name="offered_salary" value={offered_salary} className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' onChange={handleChange} />

                            <label className='md:text-lg align-top'>Job Description:</label>
                            <textarea type="text" name="job_description" value={job_description} className='border border-black p-1 md:text-lg rounded-md md:h-44 md:mb-3 h-32 text-justify resize-none' onChange={handleChange} />

                            <label className='md:text-lg align-top'>Qualification:</label>
                            <textarea type="text" name="qualification" value={qualification} className='border border-black p-1 md:text-lg rounded-md md:h-44 md:mb-3 h-32 resize-none' onChange={handleChange} />
                            
                            <label className='md:text-lg'>Posted Date:</label>
                            <input type="date" name="posted_date" value={posted_date} min={today} className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' onChange={handleChange} />

                            <label className='md:text-lg'>Deadline:</label>
                            <input type="date" name="deadline" value={deadline} min={posted_date} className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' onChange={handleChange} />
                            
                <button onClick={handleSubmit} className="border border-none bg-blue-600 rounded-md md:w-20 md:h-10 w-14 h-7 lg:mt-8 mt-3 md:text-lg text-sm"><a href="#" className=' hover:text-white'>Add</a></button>
            </form>
        </div>
    )
}

export default AddCareer
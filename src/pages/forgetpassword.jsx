import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { forgetPassword } from './api/userApi'

const ForgetPassword = () => {
    let [email, setEmail] = useState('')
    let [success, setSuccess] = useState('')
    let [error, setError] = useState('')

    let router = useRouter()

    const handleSubmit = e =>{
      e.preventDefault()
      forgetPassword(email)
      .then(data =>{
        if(data.error){
          setError(data.error)
        }
        else{
          setSuccess(data.msg)
        }
      })
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
          color: "#d33",
        })
        setError('')
      }
    }
  
    const showSuccess = () => {
      if (success) {
        Swal.fire({
          icon: "success",
          toast: true,
          title: "success",
          text: success,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          color: "#64DD17"
        })
        setSuccess('')
        return router.push('/users/resetpassword/token')

      }
    }

  return (
    <>
    {showError()}
    {showSuccess()}
   <div className='forget_password flex justify-center items-center h-[80vh]'>
    <form action="" className='lg:border-8 border-4 bg-blue-100 opacity-80 rounded-3xl lg:p-15 md:p-10 p-5'>
        <label htmlFor="email" className='p-1 font-3 md:text-[17px] text-[14px]'>Email:</label>
        <input type="email" id='email' name='email' className=' rounded-md py-1.5 w-full p-4 bg-white' onChange={e=>setEmail(e.target.value)}/>
        <button className='rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 mt-3 w-full' onClick={handleSubmit}>Forget Password</button>
    </form>
   </div>
    </>
  )
}

export default ForgetPassword
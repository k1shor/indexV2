import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { resetPassword } from '../api/userApi'

const ResetPassword = () => {
    let [password, setPassword]= useState('')
    let [confirm_password, setConfirmPassword] = useState('')
    let [success, setSuccess] = useState('')
    let [error, setError]= useState('')

    let {token} = useParams()? useParams(): ""

    let router = useRouter()

    const handleSubmit = e =>{
        e.preventDefault()
        resetPassword(password, confirm_password, token)
        .then(data=>{
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
          return router.push('/login')
        }
      }

  return (
    <>
    {showError()}
    {showSuccess()}
   <div className='forget_password flex justify-center items-center h-[80vh]'>
    <form action="" className='lg:border-8 border-4 bg-blue-200 opacity-80 rounded-3xl lg:p-15 md:p-10 p-5'>
        <div>
        <label htmlFor="password" className='p-1 font-3 md:text-[17px] text-[14px]'>Password:</label>
        <input type="password" id='password' name='password' className=' rounded-md py-1.5 w-full p-4 bg-white' onChange={e=>setPassword(e.target.value)}/>
        </div>
        <div className='mt-5'>
        <label htmlFor="confirmpassword" className='p-1 font-3 md:text-[17px] text-[14px]'>ConfirmPassword:</label>
        <input type="password" id='confirmpassword' name='confirm_password' className=' rounded-md py-1.5 w-full p-4 bg-white' onChange={e=>setConfirmPassword(e.target.value)}/>
        </div>
        <button className='rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 mt-3 w-full' onClick={handleSubmit}>Reset Password</button>
    </form>
   </div>
    </>
  )
}

export default ResetPassword
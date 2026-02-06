import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { emailConfirmation } from '../api/userApi';
import Link from 'next/link';

const VerifyEmail = () => {
  let [error, setError] = useState('')
  let [success, setSuccess] = useState('')

  //get token from url
  let params = useParams()
  let { token } = params ? params : ""


  useEffect(() => {
    emailConfirmation(token)
      .then(data => {
        if (data.error) {
          setSuccess(false)
          setError(data.error)
        }
        else {
          setError('')
          setSuccess(data.msg)
        }
      })
  }, [])

  const showError = () => {
    if (error) {
      return <div className='h-[90vh]  bg-red-100 flex justify-center items-center flex-col'>
        <div className='text-2xl mb-5'>{error}</div>
        <div>Goto <Link href={'/'} className='text-xl text-blue-700'>Home</Link></div>
      </div>
    }
  }

  const showSuccess = () => {
    if (success) {
      return <div className='h-[90vh]  bg-red-100 flex justify-center items-center flex-col'>
        <div className='text-2xl mb-5'>{error}</div>
        <div>Goto <Link href={'/'} className='text-xl text-blue-700'>Home</Link></div>
        <div>Goto <Link href={'/login'} className='text-xl text-blue-700'>Login</Link></div>
      </div>
    }
  }


  return (
    <>
      {showError()}
      {showSuccess()}
    </>
  )
}

export default VerifyEmail
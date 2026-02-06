'use client' 
import { getCategoryDetails, updateCategory } from '@/pages/api/categoryAPI'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const UpdateCategory = () => {
    let[formData, setFormData] = useState({}) 
    let [error, setError] = useState('')
    let[success, setSuccess] = useState(false)
    let router = useRouter()
    let id = useParams()?.id


    let token

    useEffect(() => {
        token = localStorage.getItem('token')
      getCategoryDetails(id).then(data => setFormData(data)
      )
  }, [success])

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        })

    }
    let {category_title, icon, description} = formData

    const handleSubmit = (event) => {
      event.preventDefault()
      updateCategory(id, formData, token)
          .then(data => {
              if (data.error) {
                  setError(data.error)
                  setSuccess(false)
                  console.log(data.error)
              }
              else {
                  setError('')
                  setSuccess(true)
                  console.log("category updated")
                  setFormData({
                    category_title: "",
                    icon: "",
                    description: ""
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
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            color: "#d33"
        });
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
            text: 'Category updated successfully.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            color: "#64DD17"
        })
        setSuccess('')
        return router.push("/admin/categories");
    }
}


  return (
    <>
    <div className='bg-blue-200 h-screen'>
            {showSuccess()}
            {showError()}
            <form className='border-2 shadow-lg bg-white rounded-md mb-10 ms-7 lg:w-3/5 md:w-5/6 w-10/12 xl:p-10 md:p-5 p-2'>
                <h1 className='font-bold lg:text-3xl lg:text-left text-center md:text-2xl pb-3'>Update category</h1>

                            <label htmlFor='category_title' className=' md:text-lg text-sm'>category_title:</label>
                            <input type="text" name="category_title"  className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7 ' 
                            onChange={handleChange}
                            value={category_title} />

                            <label htmlFor='icon' className=' md:text-lg text-sm'>Icon:</label>
                            <input type="text" name="icon"  className='border border-black p-1 md:text-lg rounded-md md:h-8 h-7' 
                            onChange={handleChange}
                            value={icon} />

                            <label htmlFor='description' className=' md:text-lg text-sm align-top'>Description:</label>
                            <textarea type="text" name="description"  className='border border-black p-1 md:text-lg rounded-md md:h-44 md:mb-3 h-32 resize-none' 
                            onChange={handleChange}
                            value={description} />

                <button onClick={handleSubmit} className="border border-none bg-blue-600 rounded-md md:w-20 md:h-10 w-14 h-7 lg:mt-8 mt-3 md:text-lg text-sm"><a href="#" className=' hover:text-white'>update</a></button>
            </form>
        </div>
    
    </>
  )
}

export default UpdateCategory
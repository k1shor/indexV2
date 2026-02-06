'use client'
import { getAppliedCareerByCareer } from '@/pages/api/applyCareerAPI'
import { getCareerDetails } from '@/pages/api/careerAPI'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_BACKEND_URL

const AppliedCareer = () => {
  let [career, setCareer] = useState([])
  let [appliedcareer, setAppliedCareer] = useState([])
  // let [filteredResult, setFilteredResult] = useState([])
  // let [filter, setFilter] = useState('')
  let [success, setSuccess] = useState(false)
  let token

  let id = useParams()?.id
  // const params = useParams()
  //   const id = params.applyCareer
  // let {career_title} = career


  useEffect(() => {
    if (typeof window !== "undefined") {
      token = localStorage.getItem('token')
    }
    getCareerDetails(id)
    .then(data => {
      // setCareer(data.find(item => item.id === id));
      // setCareer(data.find(item => item.id === id));
      setCareer(data)
      console.log(data)
    })
    getAppliedCareerByCareer(token, id)
      .then(data => {
        if (data?.error) {
          console.log(data.error)
        }
        else {
          setAppliedCareer(data)
          console.log(data)
        }
      })
  }, [id,token])

  // const handlefilter = (id) =>{
  //   console.log(id, filteredResult)
  //   setFilter(id)
  //   setFilteredResult(
  //     appliedcareer.filter(appliedCar => appliedCar.career?._id === id)
  //   )
  // }


  return (
    <>
      <div className='ms-8 md:w-4/6 w-10/12'>
        <h1 className='font-bold text-3xl'>Applied Applicants for "{career?.career_title}" </h1>
        <div className='text-black flex flex-col'>
          {
            appliedcareer?.length > 0 &&
            appliedcareer.map(applied => {
              return <div key={applied?._id} className='p-5 border-2 bg-white rounded-md shadow-lg  my-3'>
                <h1>
                  <img src={`${API}/${applied?.image}`} alt={applied?.image} style={{ height: "100px" }} />
                </h1>
                <h1>Name: {applied?.first_name} {applied?.last_name}</h1>
                <h1>Email:{applied?.email} </h1>
                <h1>Phone Number: {applied?.phone_number}</h1>
                <h1>Qualifications: {applied?.qualification}</h1>
                <h1>Experience: {applied?.experience}</h1>
                {/* <h1>
                  Curriculum Vitae: {applied.curriculum_vitae}
                  CV:
                  <embed src={`${API}/${applied?.curriculum_vitae}`} width="800px" height="200px" />

                </h1> */}
                <h1>Reference:{applied?.reference}</h1>
                <h1>Status: </h1>
                {/* <Link href={`/admin/careers/update/${applied._id}`}>
                  <span className='border-2 border-none bg-yellow-500  hover:text-white h-8 p-1.5 text-center rounded-md mr-5 '>Update</span>
                </Link> */}
                {/* <button className='border-2 border-none bg-red-500 hover:text-white w-20 h-8 rounded-md ' onClick={handleDelete(career._id)}> Delete </button> */}

              </div>
            })
          }
        </div>
      </div>

    </>
  )
}

export default AppliedCareer
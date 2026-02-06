const API = process.env.NEXT_PUBLIC_BACKEND_URL


//add career
export const addCareer = (career, token)=> {
    return fetch(`${API}/career/add_career`,{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(career)
    })
    .then(res=>res.json())
    .catch(err=>console.log(err))
} 


//view
export const view_career = () => {
    return fetch(`${API}/career/view_career`)
    .then(res=>res.json())
    .catch(err=>console.log(err))
}



//to get career details
export const getCareerDetails = (id) =>{
    return fetch(`${API}/career/view_careerdetailsbyid/${id}`)
    .then(res=>res.json())
    .catch(err=>console.log(err))
}


//to update career
export const updateCareer = (id, career_title, token) =>{
    return fetch(`${API}/career/update_career/${id}`, {
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(career_title)
    })
    .then(res =>res.json())
    .catch(err=>console.log(err))
}

//to delete career
export const deleteCareer = (id, token) =>{
    return fetch(`${API}/career/delete_career/${id}`,{
        method: "DELETE",
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    .then(res =>res.json())
    .catch(err=>console.log(err))
}
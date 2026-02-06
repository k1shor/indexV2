const API = process.env.NEXT_PUBLIC_BACKEND_URL

export const addCategory = (category, token) =>{
    return fetch (`${API}/category/add_category`,{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(res =>res.json())
    .catch(err=>console.log(err))
}

//to view all 
export const getAllCategories = () =>{
    return fetch(`${API}/category/view_category`)
    .then(res=>res.json())
    .catch(err=>console.log(err))
}

// to get category details
export const getCategoryDetails = (id) =>{
    return fetch(`${API}/category/view_categorydetailsbyid/${id}`)
    .then(res=>res.json())
    .catch(err=>console.log(err))
}

//to update category
export const updateCategory = (id, category, token) =>{
    return fetch(`${API}/category/update_category/${id}`,{
        method: "PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(res =>res.json())
    .catch(err=>console.log(err))
}


//to delete category
export const deleteCategory = (id, token) =>{
    return fetch(`${API}/category/delete_category/${id}`,{
        method: "DELETE",
        headers:{
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res =>res.json())
    .catch(err=>console.log(err))
}
import { API } from "@/consts"

export const getAbout = () => {
    return fetch(`${API}/about/get`)
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const addAbout = (about) => {
    const { token } = JSON.parse(localStorage.getItem('auth'))

    return fetch(`${API}/about/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: about
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const updateAbout = (about) => {
    const { token } = JSON.parse(localStorage.getItem('auth'))
    return fetch(`${API}/about/update`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: about
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}
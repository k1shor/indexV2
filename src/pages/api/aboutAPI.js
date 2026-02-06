import { API } from "@/consts"

export const getAbout = () => {
    return fetch(`${API}/about/get`)
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const addAbout = (about) => {
    return fetch(`${API}/about/add`, {
        method: "POST",
        headers: {
        },
        body: about
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const updateAbout = (about) => {
    return fetch(`${API}/about/update`, {
        method: "PUT",
        headers: {
        },
        body: about
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}
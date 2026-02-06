const API = process.env.NEXT_PUBLIC_BACKEND_URL

export const getSettings = (token) => {
    return fetch(`${API}/getsettings`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const updateAbout = (about, token) => {
    return fetch(`${API}/updateabout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ about })
    })
        .then(response => response.json())
        .catch(error => console.log(error))
}

export const getReasonsforIndex = () => {
    return fetch(`${API}/reasons`)
        .then(response => response.json())
        .catch(error => console.log(error))
}
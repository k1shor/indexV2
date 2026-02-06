'use client'
const API = process.env.NEXT_PUBLIC_BACKEND_URL

// ✅ REGISTER USER (supports file upload)
export const userRegister = (userData) => {
  // userData should be FormData (includes image + text)
  return fetch(`${API}/user/register`, {
    method: 'POST',
    body: userData
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ VERIFY EMAIL
export const emailConfirmation = (token) => {
  return fetch(`${API}/user/verify/${token}`)
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ RESEND VERIFICATION EMAIL
export const resendVerification = (email) => {
  return fetch(`${API}/user/resendverification`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ FORGET PASSWORD
export const forgetPassword = (email) => {
  return fetch(`${API}/user/forgetpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ RESET PASSWORD
export const resetPassword = (password, token) => {
  return fetch(`${API}/user/resetpassword/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ LOGIN
export const userLogin = (user) => {
  return fetch(`${API}/user/signin`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ LOGOUT
export const userLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// ✅ GET ALL USERS (Admin only, with optional search & pagination)
export const getAllUsers = (token, search = "", page = 1, limit = 10) => {
  return fetch(`${API}/user/getallusers?search=${search}&page=${page}&limit=${limit}`, {
    headers: {
      Authorization: token
    }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ GET SINGLE USER DETAILS (Admin)
export const getUserDetails = (id, token) => {
  return fetch(`${API}/user/getuser/${id}`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ UPDATE USER (Admin) – supports file upload
export const updateUser = (id, formData, token) => {
  return fetch(`${API}/user/updateuser/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token
      // No "Content-Type" when sending FormData
    },
    body: formData
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ DELETE USER (Admin)
export const deleteUser = (id, token) => {
  return fetch(`${API}/user/deleteuser/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ CHANGE ROLE (Admin)
export const changeUserRole = (id, role, token) => {
  return fetch(`${API}/user/changerole/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ role })
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ VERIFY USER BY ADMIN (Admin)
export const verifyUserByAdmin = (id, token) => {
  return fetch(`${API}/user/verifyuserbyadmin/${id}`, {
    method: "PUT",
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ GET CURRENT LOGGED-IN USER PROFILE
export const getProfile = (token) => {
  return fetch(`${API}/user/profile`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ UPDATE PROFILE (Logged-in user) – supports image upload
export const updateProfile = (formData, token) => {
  return fetch(`${API}/user/updateprofile`, {
    method: "PUT",
    headers: { Authorization: token },
    body: formData // includes image, name, etc.
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ USER STATISTICS (for dashboard)
export const getUserStats = (token) => {
  return fetch(`${API}/user/stats`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .catch(err => console.log(err))
}

// ✅ AUTHENTICATE & KEEP USER SIGNED IN
export const authenticate = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth', JSON.stringify(data))
  }
}

// ✅ CHECK IF USER IS LOGGED IN
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('auth')
  return stored ? JSON.parse(stored).token : false
}

// app/register/page.jsx
'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { userRegister } from './api/userApi';

export const metadata = {
  title: 'Register | Index IT Hub',
  description: 'Create your Index IT Hub account to access projects and your dashboard.',
  keywords: ['Index IT Hub', 'Register', 'Sign up', 'User Account'],
  openGraph: {
    title: 'Register - Index IT Hub',
    description: 'Create your Index IT Hub account.',
    url: 'https://indexithub.com/register',
    siteName: 'Index IT Hub',
    images: [
      {
        url: 'https://indexithub.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Index IT Hub Register Page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const Register = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    age: '',
    phone_number: '',
    temporary_address: '',
    permanent_address: '',
    gender: '',
    image: '',
    formdata: new FormData(),
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fileRef = useRef(null);

  const {
    first_name,
    last_name,
    username,
    email,
    password,
    confirm_password,
    age,
    phone_number,
    temporary_address,
    permanent_address,
    gender,
    formdata,
  } = user;

  const handleChange = (event) => {
    const { name, type, files, value } = event.target;
    const nextVal = type === 'file' ? files?.[0] ?? '' : value;

    // Update state
    setUser((prev) => ({
      ...prev,
      [name]: nextVal,
    }));

    // Keep FormData in sync
    formdata.set(name, nextVal);
  };

  const validate = () => {
    if (!first_name.trim()) return 'Please enter your first name.';
    if (!last_name.trim()) return 'Please enter your last name.';
    if (!username.trim()) return 'Please enter a username.';
    if (!email.trim()) return 'Please enter your email.';
    // very light email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!confirm_password) return 'Please confirm your password.';
    if (password !== confirm_password) return 'Passwords do not match.';
    if (!age) return 'Please enter your age.';
    if (!phone_number.trim()) return 'Please enter your phone number.';
    if (!temporary_address.trim()) return 'Please enter your temporary address.';
    if (!permanent_address.trim()) return 'Please enter your permanent address.';
    if (!gender) return 'Please select your gender.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setSubmitting(true);

      // Build FormData properly to match backend field names
      const fd = new FormData();
      fd.append("firstname", first_name);
      fd.append("lastname", last_name);
      fd.append("username", username);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("gender", gender);
      fd.append("age", age);
      fd.append("phonenumber", phone_number);
      fd.append("address[tempAddress][]", temporary_address);
      fd.append("address[permanentAddress]", permanent_address);

      if (user.image) {
        fd.append("image", user.image); // File upload
      }

      const data = await userRegister(fd);

      if (data?.error) {
        setSuccess(false);
        setError(data.error);
      } else {
        setSuccess(true);
        setUser({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          confirm_password: '',
          age: '',
          phone_number: '',
          temporary_address: '',
          permanent_address: '',
          gender: '',
          image: '',
          formdata: new FormData(),
        });
        if (fileRef.current) fileRef.current.value = '';
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  // Toast side-effects
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        toast: true,
        title: 'Error',
        text: error,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        color: '#d33',
      });
      setError('');
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        toast: true,
        title: 'Success',
        text: 'User registered successfully. Please verify via the email we sent.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        color: '#64DD17',
      });
      setSuccess(false);
    }
  }, [success]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md border border-blue-200/60 shadow-2xl rounded-3xl py-10"
        >
          <div className="px-6 md:px-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-center text-blue-800">
              Register Here
            </h1>

            <div className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-6">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-semibold text-blue-900 mb-1">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={first_name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="Jane"
                />
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label htmlFor="last_name" className="block text-sm font-semibold text-blue-900 mb-1">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={last_name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="Doe"
                />
              </div>

              {/* Username */}
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-semibold text-blue-900 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="jane.doe"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div className="sm:col-span-3">
                <label htmlFor="confirm_password" className="block text-sm font-semibold text-blue-900 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={confirm_password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Age */}
              <div className="sm:col-span-3">
                <label htmlFor="age" className="block text-sm font-semibold text-blue-900 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={age}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="25"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone_number" className="block text-sm font-semibold text-blue-900 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={phone_number}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="+977-98XXXXXXXX"
                />
              </div>

              {/* Temporary Address */}
              <div className="sm:col-span-3">
                <label htmlFor="temporary_address" className="block text-sm font-semibold text-blue-900 mb-1">
                  Temporary Address
                </label>
                <input
                  id="temporary_address"
                  name="temporary_address"
                  type="text"
                  value={temporary_address}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="Current city, area"
                />
              </div>

              {/* Permanent Address */}
              <div className="sm:col-span-3">
                <label htmlFor="permanent_address" className="block text-sm font-semibold text-blue-900 mb-1">
                  Permanent Address
                </label>
                <input
                  id="permanent_address"
                  name="permanent_address"
                  type="text"
                  value={permanent_address}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
                  placeholder="Home city, area"
                />
              </div>

              {/* Gender */}
              <div className="sm:col-span-3">
                <span className="block text-sm font-semibold text-blue-900 mb-1">Gender</span>
                <div className="flex items-center gap-4 rounded-lg bg-white/60 border border-blue-200 px-4 py-2">
                  <label className="flex items-center gap-2 text-sm text-blue-900">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-blue-900">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>Female</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-blue-900">
                    <input
                      type="radio"
                      name="gender"
                      value="others"
                      checked={gender === 'others'}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="sm:col-span-3">
                <label htmlFor="image" className="block text-sm font-semibold text-blue-900 mb-1">
                  Profile Photo
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  ref={fileRef}
                  className="block w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700 transition"
                />
              </div>
            </div>
          </div>

          <div className="px-6 md:px-12">
            <div className="mt-10 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-1/2 mx-auto rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold text-sm md:text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Registering…' : 'Register'}
              </button>
              <p className="mt-4 text-sm md:text-base text-blue-900">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-700 font-semibold hover:text-blue-800 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Decorative ring */}
        <div className="mt-6 h-2 w-44 mx-auto rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 opacity-70" />
      </div>
    </div>
  );
};

export default Register;

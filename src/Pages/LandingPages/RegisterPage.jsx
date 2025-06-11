import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Components/Button';
import { createUser } from '../../services/userService';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    username: '',
    password: '',
    address: '',
    type: 'editor' // default value
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Use the service instead of direct axios call
    const response = await createUser(formData);
    console.log('Registration successful:', response.data);
    
    navigate('/login');
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    // Add error state to show to user
  }
};

  return (
    <div className="px-6 md:px-20 py-12 bg-gradient-to-b from-[#f8f4ff] to-[#e8e0ff] min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-[#552583] mb-8 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#552583] font-semibold mb-1">First Name*</label>
              <input
                type="text"
                name="firstName"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Last Name*</label>
              <input
                type="text"
                name="lastName"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Age*</label>
              <input
                type="number"
                name="age"
                min="1"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Gender*</label>
              <select
                name="gender"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Contact Number*</label>
            <input
              type="tel"
              name="contactNumber"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Email*</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Username*</label>
            <input
              type="text"
              name="username"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Password*</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Address*</label>
            <textarea
              name="address"
              rows="3"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6">Create Account</Button>
        </form>
      </div>
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <span
          className="text-[#552583] font-semibold cursor-pointer hover:underline"
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </div>
    </div>
  );
}

export default RegisterPage;
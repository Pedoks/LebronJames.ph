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

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    // Age validation
    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Please enter a valid age between 1 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare data for submission - only include non-empty fields
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        type: formData.type || 'editor'
      };

      // Add optional fields only if they have values
      if (formData.username && formData.username.trim()) {
        submitData.username = formData.username.trim();
      }
      if (formData.age && formData.age.trim()) {
        submitData.age = formData.age.trim();
      }
      if (formData.gender && formData.gender.trim()) {
        submitData.gender = formData.gender.trim();
      }
      if (formData.contactNumber && formData.contactNumber.trim()) {
        submitData.contactNumber = formData.contactNumber.trim();
      }
      if (formData.address && formData.address.trim()) {
        submitData.address = formData.address.trim();
      }

      console.log('Submitting registration data:', { ...submitData, password: '[HIDDEN]' });

      const response = await createUser(submitData);
      console.log('Registration successful:', response.data);
      
      // Show success message or redirect
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error.response?.data?.message) {
        // Handle specific error messages from backend
        if (error.response.data.message.includes('email')) {
          setErrors({ email: error.response.data.message });
        } else if (error.response.data.message.includes('username')) {
          setErrors({ username: error.response.data.message });
        } else if (error.response.data.message.includes('Password')) {
          setErrors({ password: error.response.data.message });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-20 py-12 bg-gradient-to-b from-[#f8f4ff] to-[#e8e0ff] min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-[#552583] mb-8 text-center">Sign Up</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#552583] font-semibold mb-1">First Name*</label>
              <input
                type="text"
                name="firstName"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Last Name*</label>
              <input
                type="text"
                name="lastName"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Age</label>
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                  errors.age ? 'border-red-500' : ''
                }`}
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-[#552583] font-semibold mb-1">Gender</label>
              <select
                name="gender"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Email*</label>
            <input
              type="email"
              name="email"
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                errors.email ? 'border-red-500' : ''
              }`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                errors.username ? 'border-red-500' : ''
              }`}
              value={formData.username}
              onChange={handleChange}
              placeholder="Leave empty to auto-generate from email"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            <p className="text-sm text-gray-500 mt-1">Optional: Will be generated from email if not provided</p>
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Password*</label>
            <input
              type="password"
              name="password"
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927] ${
                errors.password ? 'border-red-500' : ''
              }`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <label className="block text-[#552583] font-semibold mb-1">Address</label>
            <textarea
              name="address"
              rows="3"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
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
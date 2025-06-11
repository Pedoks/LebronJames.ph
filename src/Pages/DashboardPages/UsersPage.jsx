import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle 
} from 'lucide-react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/userService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    address: '',
    email: '',
    type: 'viewer',
    username: '',
    password: '',
    status: 'active'
  });

  // Load users from API on component mount
useEffect(() => {
  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      const userData = (response.data || []).map(user => ({
        ...user,
        status: user.isActive ? 'active' : 'inactive', // Add status field
        id: user._id // Add id alias for compatibility
      }));
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error('Error:', error);
      // Initialize sample users with _id
      const samples = sampleUsers.map(u => ({ ...u, _id: u.id,isActive: u.status === 'active' }));
      isActive: u.status === 'active'
      setUsers(samples);
      setFilteredUsers(samples);
    }
  };
  loadUsers();
}, []);

  // Filter and search users
  useEffect(() => {
    let filtered = users;

    // Apply type filter
    if (filterType !== 'all') {
  filtered = filtered.filter(user => 
    user.type.toLowerCase() === filterType.toLowerCase()
  );
}

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        Object.values(user).some(value =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, filterType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleAddUser = async () => {
  // Validate required fields
  if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
    alert('Please fill in all required fields (First Name, Last Name, Email, and Password)');
    return;
  }

  try {
    setIsLoading(true); // Start loading
    
    // Prepare the user data for backend
    const userToCreate = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username || newUser.email, // Fallback to email if username empty
      password: newUser.password, // Backend will hash this
      age: newUser.age || undefined, // Send undefined if empty
      gender: newUser.gender || undefined,
      contactNumber: newUser.contactNumber || undefined,
      address: newUser.address || undefined,
      type: newUser.type || 'viewer', // Default to viewer
      isActive: newUser.status === 'active' // Convert to boolean
    };

    // Remove empty fields to avoid validation issues
    Object.keys(userToCreate).forEach(key => {
      if (userToCreate[key] === undefined || userToCreate[key] === '') {
        delete userToCreate[key];
      }
    });

    console.log('Submitting user:', userToCreate); // Debug log

    const response = await createUser(userToCreate);
    const createdUser = response.data;

    // Update state with the new user
    setUsers(prevUsers => [...prevUsers, {
      ...createdUser,
      // Frontend-specific fields
      status: createdUser.isActive ? 'active' : 'inactive',
      joinDate: new Date().toISOString().split('T')[0] // Add today's date
    }]);

    // Reset form
    setNewUser({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      address: '',
      email: '',
      type: 'viewer',
      username: '',
      password: '',
      status: 'active'
    });

    setShowAddForm(false);
    toast.success('User created successfully!');
    
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error(error.response?.data?.message || 'Failed to create user. Please try again.');
  } finally {
    setIsLoading(false); // End loading
  }
};

const handleEditUser = (user) => {
  setEditingUser(user);
  setNewUser({
    ...user,
    status: user.isActive ? 'active' : 'inactive' // Convert for form
  });
  setShowAddForm(true);
};

const handleUpdateUser = async () => {
  try {
    setIsLoading(true);
    
    // Convert to backend-compatible format
    const userToUpdate = {
      ...newUser,
      isActive: newUser.status === 'active'
    };
    delete userToUpdate.status;
    delete userToUpdate.id; // Remove frontend-specific fields

    const response = await updateUser(editingUser._id, userToUpdate);
    const updatedUser = response.data;

    setUsers(users.map(user => 
      user._id === editingUser._id ? {
        ...updatedUser,
        status: updatedUser.isActive ? 'active' : 'inactive' // Convert back for frontend
      } : user
    ));
    
    setShowAddForm(false);
    toast.success('User updated successfully!');
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error(error.response?.data?.message || 'Update failed');
  } finally {
    setIsLoading(false);
  }
};

const handleDeleteUser = (user) => {
  setUserToDelete(user);
  setShowDeleteModal(true);
};

const confirmDeleteUser = async () => {
  if (!userToDelete) return;
  
  try {
    setDeleteLoading(true);
    await deleteUser(userToDelete._id);
    setUsers(users.filter(user => user._id !== userToDelete._id));
    toast.success('User deleted successfully!');
    setShowDeleteModal(false);
    setUserToDelete(null);
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error(error.response?.data?.message || 'Failed to delete user');
  } finally {
    setDeleteLoading(false);
  }
};

const toggleUserStatus = async (userId) => {
  try {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    const response = await updateUser(user._id, {
      isActive: !user.isActive
    });
    
    setUsers(users.map(u => 
      u._id === userId ? {
        ...u,
        isActive: !u.isActive,
        status: !u.isActive ? 'active' : 'inactive'
      } : u
    ));
  } catch (error) {
    console.error('Status update failed:', error);
    toast.error('Failed to update status');
  }
};

  const getTypeColor = (type) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

const stats = {
  total: users.length,
  active: users.filter(u => (u.isActive !== undefined ? u.isActive : u.status === 'active')).length,
  admins: users.filter(u => u.type === 'admin').length,
  editors: users.filter(u => u.type === 'editor').length,
  viewers: users.filter(u => u.type === 'viewer').length
};
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage your application users and their permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">A</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Editors</p>
                <p className="text-2xl font-bold text-blue-600">{stats.editors}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">E</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viewers</p>
                <p className="text-2xl font-bold text-green-600">{stats.viewers}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                  setNewUser({
                    firstName: '',
                    lastName: '',
                    age: '',
                    gender: '',
                    contactNumber: '',
                    address: '',
                    email: '',
                    type: 'viewer',
                    username: '',
                    password: '',
                    status: 'active'
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={newUser.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={newUser.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={newUser.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  name="type"
                  value={newUser.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>{editingUser ? 'Update User' : 'Add User'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.contactNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(user.type)}`}>
                        {user.type}
                      </span>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
  <button
    onClick={() => toggleUserStatus(user._id)}
    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
      (user.isActive ?? user.status === 'active') 
        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
        : 'bg-red-100 text-red-800 hover:bg-red-200'
    }`}
  >
    {(user.isActive ?? user.status === 'active') ? 'Active' : 'Inactive'}
  </button>
</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit user"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
<button
  onClick={() => handleDeleteUser(user)}  // Correct - passing full user object
  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
  title="Delete user"
>
  <Trash2 className="h-4 w-4" />
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
{/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold">
              {userToDelete?.firstName} {userToDelete?.lastName}
            </span>
            ? This will permanently remove their account and all associated data.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setUserToDelete(null);
            }}
            disabled={deleteLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUser}
            disabled={deleteLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first user.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
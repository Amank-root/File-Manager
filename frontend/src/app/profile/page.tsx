"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaKey } from 'react-icons/fa';
import useAuthStore from '@/app/store/authStore';
import useUserStore from '@/app/store/userStore';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import { Address } from '@/app/store/userStore';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone_number?: string;
}

interface PasswordFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface AddressFormData {
  address_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const ProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { 
    profile, 
    addresses, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile, 
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    clearErrors 
  } = useUserStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Profile form
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfileForm,
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>();
  
  // Password form
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
    watch: watchPassword
  } = useForm<PasswordFormData>();
  
  const newPassword = watchPassword('new_password');
  
  // Address form
  const { 
    register: registerAddress, 
    handleSubmit: handleAddressSubmit, 
    reset: resetAddressForm,
    setValue: setAddressValue,
    formState: { errors: addressErrors } 
  } = useForm<AddressFormData>();
  
  // Check authentication
  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, checkAuth]);
  
  // Load profile data
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);
  
  // Reset profile form when profile data is loaded
  useEffect(() => {
    if (profile) {
      resetProfileForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile, resetProfileForm]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);
  
  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      // Error will be handled by the store
    }
  };
  
  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const success = await changePassword(data);
      if (success) {
        toast.success('Password changed successfully');
        resetPasswordForm();
        setShowPasswordModal(false);
      }
    } catch (err) {
      // Error will be handled by the store
    }
  };
  
  // Handle address add/edit
  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
        toast.success('Address updated successfully');
      } else {
        await addAddress(data);
        toast.success('Address added successfully');
      }
      resetAddressForm();
      setEditingAddress(null);
      setShowAddressModal(false);
    } catch (err) {
      // Error will be handled by the store
    }
  };
  
  // Open address modal for editing
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    
    // Set form values
    setAddressValue('address_type', address.address_type);
    setAddressValue('street_address', address.street_address);
    setAddressValue('city', address.city);
    setAddressValue('state', address.state);
    setAddressValue('postal_code', address.postal_code);
    setAddressValue('country', address.country);
    setAddressValue('is_default', address.is_default);
    
    setShowAddressModal(true);
  };
  
  // Open address modal for adding
  const handleAddAddress = () => {
    resetAddressForm({
      address_type: 'home',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowAddressModal(true);
  };
  
  // Handle address delete
  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        toast.success('Address deleted successfully');
      } catch (err) {
        // Error will be handled by the store
      }
    }
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'profile'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Personal Information
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'addresses'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Addresses
            </button>
          </li>
        </ul>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && profile && (
            <div className="bg-white text-black p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-1"
                >
                  <FaKey />
                  Change Password
                </Button>
              </div>
              
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="First Name"
                    id="first_name"
                    placeholder="John"
                    error={profileErrors.first_name?.message}
                    {...registerProfile('first_name', { required: 'First name is required' })}
                  />
                  
                  <Input
                    label="Last Name"
                    id="last_name"
                    placeholder="Doe"
                    error={profileErrors.last_name?.message}
                    {...registerProfile('last_name', { required: 'Last name is required' })}
                  />
                </div>
                
                <div className="mb-6">
                  <Input
                    label="Email"
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    helperText="You cannot change your email address"
                  />
                </div>
                
                <Input
                  label="Phone Number (optional)"
                  id="phone_number"
                  placeholder="+1234567890"
                  error={profileErrors.phone_number?.message}
                  {...registerProfile('phone_number')}
                />
                
                <div className="mt-6">
                  <Button type="submit" isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white text-black p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Addresses</h2>
                <Button
                  onClick={handleAddAddress}
                  className="flex items-center gap-1"
                >
                  <FaPlus />
                  Add Address
                </Button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any addresses yet.</p>
                  <Button onClick={handleAddAddress}>Add Your First Address</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{address.address_type}</span>
                          {address.is_default && (
                            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-600 hover:text-primary-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="mb-1">{address.street_address}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            
            <form onSubmit={handleAddressSubmit(onAddressSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border shadow-sm border-slate-300 rounded-md"
                  {...registerAddress('address_type', { required: 'Please select an address type' })}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
                {addressErrors.address_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {addressErrors.address_type.message}
                  </p>
                )}
              </div>
              
              <Input
                label="Street Address"
                id="street_address"
                error={addressErrors.street_address?.message}
                {...registerAddress('street_address', { required: 'Street address is required' })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  id="city"
                  error={addressErrors.city?.message}
                  {...registerAddress('city', { required: 'City is required' })}
                />
                
                <Input
                  label="State/Province"
                  id="state"
                  error={addressErrors.state?.message}
                  {...registerAddress('state', { required: 'State is required' })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  id="postal_code"
                  error={addressErrors.postal_code?.message}
                  {...registerAddress('postal_code', { required: 'Postal code is required' })}
                />
                
                <Input
                  label="Country"
                  id="country"
                  error={addressErrors.country?.message}
                  {...registerAddress('country', { required: 'Country is required' })}
                />
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  {...registerAddress('is_default')}
                />
                <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddressModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <Input
                label="Current Password"
                id="old_password"
                type="password"
                error={passwordErrors.old_password?.message}
                {...registerPassword('old_password', { required: 'Current password is required' })}
              />
              
              <Input
                label="New Password"
                id="new_password"
                type="password"
                error={passwordErrors.new_password?.message}
                {...registerPassword('new_password', { 
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              
              <Input
                label="Confirm New Password"
                id="confirm_password"
                type="password"
                error={passwordErrors.confirm_password?.message}
                {...registerPassword('confirm_password', { 
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
              />
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 
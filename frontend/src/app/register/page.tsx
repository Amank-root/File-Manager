"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import useAuthStore from '@/app/store/authStore';

interface RegisterFormData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearErrors } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Submitting registration data:", data);
      await registerUser(data);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      console.error("Registration error:", error);
      // Error handling is managed by the store
    }
  };
  
  return (
    <div className="max-w-md mx-auto text-black bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        
        <div className="flex gap-4">
          <Input
            label="First Name"
            id="first_name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register('first_name', { required: 'First name is required' })}
          />
          
          <Input
            label="Last Name"
            id="last_name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register('last_name', { required: 'Last name is required' })}
          />
        </div>
        
        <Input
          label="Phone Number (optional)"
          id="phone_number"
          placeholder="+1234567890"
          error={errors.phone_number?.message}
          {...register('phone_number')}
        />
        
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter password"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        
        <Input
          label="Confirm Password"
          id="password2"
          type="password"
          placeholder="Confirm password"
          error={errors.password2?.message}
          {...register('password2', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          className="mt-4 bg-black"
        >
          Register
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import useAuthStore from '@/app/store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearErrors } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <div className="max-w-md mx-auto text-black bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
      
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
        
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          className="mt-4 bg-black"
        >
          Login
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 
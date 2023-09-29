import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthService } from '../services/AuthService';

type Form<T> = {
  name: T;
  email: T;
  password: T;
  confirmPassword: T;
};

const Register = () => {
  const [formData, setFormData] = useState<Form<string>>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setErrors((prev) => ({ ...prev, confirmPassword: true }));
    }
    setLoading(true);

    const { name, email, password } = formData;
    const result = await authService.register(name, email, password);
    if (result.data) {
      toast.success('Account registration successful', { position: 'top-right' });
      setTimeout(() => navigate('/login'), 500);
    } else {
      toast.error(result.error, { duration: 4000, position: 'top-right' });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-4 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  maxLength={14}
                  required
                  className="block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  autoComplete="email"
                  required
                  className="block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  autoComplete="current-password"
                  required
                  className="block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className={`${
                    errors.confirmPassword
                      ? 'text-red-500'
                      : 'block text-sm font-medium leading-6 text-gray-900'
                  }`}
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm your password"
                  autoComplete="current-password"
                  required
                  className={`${
                    errors.confirmPassword ? 'ring-red-500' : 'ring-gray-300'
                  } block px-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">Passwords should match</p>
              )}
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="flex align-center w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              >
                {loading && (
                  <div className="mx-1 mt-[4px] w-4 h-4 rounded-full animate-spin border-4 border-solid border-t-transparent" />
                )}
                <div>Sign up</div>
              </button>
            </div>
          </form>
        </div>

        <div>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? &nbsp;
            <Link
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
              to={'/login'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

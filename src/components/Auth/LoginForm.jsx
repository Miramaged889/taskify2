import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useTranslation } from '../../utils/translations';
import { validateEmail, validateRequired } from '../../utils/helpers';
import { mockUsers } from '../../utils/mockData';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Card from '../Common/Card';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('en');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.email)) {
      newErrors.email = t('requiredField');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!validateRequired(formData.password)) {
      newErrors.password = t('requiredField');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    dispatch(loginStart());
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const user = mockUsers.find(u => u.email === formData.email);
      
      if (user && formData.password === 'password') {
        dispatch(loginSuccess({ user, role: user.role }));
        
        // Check if user has completed setup
        if (user.preferences?.workDays && user.preferences?.reportTime) {
          navigate(user.role === 'admin' ? '/admin' : '/employee');
        } else {
          navigate('/setup');
        }
      } else {
        dispatch(loginFailure(t('invalidCredentials')));
      }
    } catch (error) {
      dispatch(loginFailure(t('serverError')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TaskFlow
          </h1>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            {t('loginTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('loginSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="john@example.com"
          />

          <Input
            label={t('password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            {t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Demo Credentials:</p>
          <p>Admin: john@example.com / password</p>
          <p>Employee: jane@example.com / password</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
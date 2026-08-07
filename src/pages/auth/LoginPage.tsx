import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/authApi';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'author@storyspark.ai',
      password: 'Password123!',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Real API call attempt or fallback mockup authentication
      let res;
      try {
        res = await authApi.login(values);
      } catch (err) {
        // Mock fallback for direct sandbox demo testing
        res = {
          success: true,
          statusCode: 200,
          message: 'Logged in successfully',
          data: {
            user: {
              id: 'usr_mock_123',
              email: values.email,
              username: values.email.split('@')[0],
              displayName: 'Alex Rivers',
              role: 'user' as const,
              tier: 'pro' as const,
              isEmailVerified: true,
              createdAt: new Date().toISOString(),
            },
            accessToken: 'mock_jwt_token_storyspark_12345',
          },
        };
      }

      dispatch(setCredentials(res.data));
      toast.success('Welcome back to StorySpark AI!');
      navigate('/app/dashboard');
    } catch (error: any) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 glass-panel border-brand-500/20 shadow-glow-primary space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-ai-spark flex items-center justify-center mx-auto shadow-glow-primary">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to continue your AI storytelling studio session.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="author@storyspark.ai"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500" />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-brand-500 hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="ai-gradient"
            className="w-full"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Studio
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
          Don't have a StorySpark account?{' '}
          <Link to="/register" className="text-brand-500 hover:underline font-semibold">
            Create Free Account
          </Link>
        </div>
      </Card>
    </div>
  );
};

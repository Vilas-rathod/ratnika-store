import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { loginSchema, type LoginForm } from '@/lib/validation';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/services/http';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const from = (location.state as { from?: string } | null)?.from;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(from ?? (user.role === 'ADMIN' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const fillDemo = (role: 'admin' | 'customer') => {
    const email = role === 'admin' ? 'admin@ratnika.in' : 'customer@ratnika.in';
    const password = role === 'admin' ? 'Admin@123' : 'Customer@123';
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to Ratnika.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
        <p className="mb-2 font-medium">Demo accounts (mock mode)</p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('customer')}>
            Customer
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => fillDemo('admin')}>
            Admin
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

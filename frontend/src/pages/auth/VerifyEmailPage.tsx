import { MailCheck } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { OtpInput } from '@/components/shared/OtpInput';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/services/http';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState(
    (location.state as { email?: string } | null)?.email ?? user?.email ?? '',
  );
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const verified = await authService.verifyOtp({ email, otp });
      setUser(verified);
      toast.success('Email verified successfully!');
      navigate('/account');
    } catch (err) {
      toast.error((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await authService.resendOtp(email);
      toast.info('Verification code sent (demo code: 123456)');
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <div className="text-center">
      <MailCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
      <h1 className="font-display text-2xl font-semibold">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've sent a 6-digit code to your email. Enter it below to activate your account.
      </p>

      <div className="mt-6 space-y-4 text-left">
        {!user && (
          <FormField label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </FormField>
        )}
        <FormField label="Verification Code">
          <OtpInput value={otp} onChange={setOtp} />
        </FormField>
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={verify} loading={loading}>
        Verify Email
      </Button>

      <p className="mt-4 text-sm text-muted-foreground">
        Didn't receive it?{' '}
        <button onClick={resend} className="font-medium text-primary hover:underline">
          Resend code
        </button>
      </p>
    </div>
  );
}

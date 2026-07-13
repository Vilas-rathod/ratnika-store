import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, UserCog } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordForm,
  type ProfileForm,
} from '@/lib/validation';
import { accountService } from '@/services/account.service';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/services/http';

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  });

  const passwordForm = useForm<ChangePasswordForm>({ resolver: zodResolver(changePasswordSchema) });

  const saveProfile = async (data: ProfileForm) => {
    try {
      const updated = await accountService.updateProfile(data);
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const changePassword = async (data: ChangePasswordForm) => {
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" /> Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First Name" error={profileForm.formState.errors.firstName?.message} required>
                <Input {...profileForm.register('firstName')} />
              </FormField>
              <FormField label="Last Name" error={profileForm.formState.errors.lastName?.message} required>
                <Input {...profileForm.register('lastName')} />
              </FormField>
            </div>
            <FormField label="Email">
              <Input value={user?.email ?? ''} disabled />
            </FormField>
            <FormField label="Phone" error={profileForm.formState.errors.phone?.message} required>
              <Input {...profileForm.register('phone')} />
            </FormField>
            <Button type="submit" loading={profileForm.formState.isSubmitting}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4">
            <FormField
              label="Current Password"
              error={passwordForm.formState.errors.currentPassword?.message}
              required
            >
              <Input type="password" {...passwordForm.register('currentPassword')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="New Password"
                error={passwordForm.formState.errors.newPassword?.message}
                required
              >
                <Input type="password" {...passwordForm.register('newPassword')} />
              </FormField>
              <FormField
                label="Confirm Password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                required
              >
                <Input type="password" {...passwordForm.register('confirmPassword')} />
              </FormField>
            </div>
            <Button type="submit" loading={passwordForm.formState.isSubmitting}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

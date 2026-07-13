import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Store } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { StoreSettings } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PageLoader } from '@/components/shared/Spinner';
import { USE_MOCK_API } from '@/lib/constants';
import { adminService } from '@/services/admin.service';
import { resetDB } from '@/mock/db';
import type { ApiError } from '@/services/http';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminService.getSettings(),
  });

  const { register, handleSubmit, control, reset, formState: { isSubmitting } } =
    useForm<StoreSettings>();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const save = async (data: StoreSettings) => {
    try {
      await adminService.updateSettings({
        ...data,
        freeShippingThreshold: Number(data.freeShippingThreshold),
        shippingFee: Number(data.shippingFee),
      });
      toast.success('Settings saved');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  const resetDemoData = () => {
    resetDB();
    queryClient.clear();
    toast.success('Demo data reset. Reloading…');
    setTimeout(() => window.location.reload(), 800);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Settings" description="Configure your store preferences" />

      <form onSubmit={handleSubmit(save)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" /> Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Store Name">
              <Input {...register('storeName')} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Support Email">
                <Input type="email" {...register('supportEmail')} />
              </FormField>
              <FormField label="Support Phone">
                <Input {...register('supportPhone')} />
              </FormField>
            </div>
            <FormField label="Store Address">
              <Input {...register('addressLine')} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping & Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Free Shipping Threshold (₹)">
                <Input type="number" {...register('freeShippingThreshold')} />
              </FormField>
              <FormField label="Shipping Fee (₹)">
                <Input type="number" {...register('shippingFee')} />
              </FormField>
            </div>
            <Controller
              control={control}
              name="codEnabled"
              render={({ field }) => (
                <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  Enable Cash on Delivery
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" loading={isSubmitting}>
          Save Settings
        </Button>
      </form>

      {USE_MOCK_API && (
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" /> Demo Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              You're running in mock mode. Reset all demo data (products, orders, customers) back to
              its original seeded state.
            </p>
            <Button type="button" variant="outline" onClick={resetDemoData}>
              <RefreshCw className="h-4 w-4" /> Reset Demo Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

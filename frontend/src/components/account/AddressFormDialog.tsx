import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { Address } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDIAN_STATES } from '@/lib/constants';
import { addressSchema, type AddressForm } from '@/lib/validation';
import { accountService } from '@/services/account.service';
import type { ApiError } from '@/services/http';

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Address | null;
  onSaved: (address: Address) => void;
}

export function AddressFormDialog({ open, onOpenChange, editing, onSaved }: AddressFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India', type: 'HOME' },
  });

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              fullName: editing.fullName,
              phone: editing.phone,
              line1: editing.line1,
              line2: editing.line2 ?? '',
              city: editing.city,
              state: editing.state,
              pincode: editing.pincode,
              country: editing.country,
              type: editing.type,
              isDefault: editing.isDefault,
            }
          : { country: 'India', type: 'HOME', isDefault: false },
      );
    }
  }, [open, editing, reset]);

  const onSubmit = async (data: AddressForm) => {
    try {
      const saved = editing
        ? await accountService.updateAddress(editing.id, data)
        : await accountService.addAddress(data);
      toast.success(editing ? 'Address updated' : 'Address added');
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      toast.error((err as ApiError).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" error={errors.fullName?.message} required>
              <Input placeholder="Aarav Sharma" {...register('fullName')} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message} required>
              <Input placeholder="+91 98765 43210" {...register('phone')} />
            </FormField>
          </div>

          <FormField label="Address Line 1" error={errors.line1?.message} required>
            <Input placeholder="House no, Building, Street" {...register('line1')} />
          </FormField>
          <FormField label="Address Line 2" error={errors.line2?.message}>
            <Input placeholder="Landmark, Area (optional)" {...register('line2')} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="City" error={errors.city?.message} required>
              <Input placeholder="Pune" {...register('city')} />
            </FormField>
            <FormField label="State" error={errors.state?.message} required>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Pincode" error={errors.pincode?.message} required>
              <Input placeholder="411001" {...register('pincode')} />
            </FormField>
          </div>

          <FormField label="Address Type">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOME">Home</SelectItem>
                    <SelectItem value="WORK">Work</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                Set as default address
              </label>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editing ? 'Update' : 'Save'} Address
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

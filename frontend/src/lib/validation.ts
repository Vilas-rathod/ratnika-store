import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number');

const phoneSchema = z
  .string()
  .min(10, 'Enter a valid phone number')
  .regex(/^[+]?[0-9\s-]{10,15}$/, 'Enter a valid phone number');

const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pincode');

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterForm = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, 'Enter the 6-digit code'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema,
});
export type ProfileForm = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: phoneSchema,
  line1: z.string().min(4, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: pincodeSchema,
  country: z.string().default('India'),
  type: z.enum(['HOME', 'WORK', 'OTHER']),
  isDefault: z.boolean().optional(),
});
export type AddressForm = z.infer<typeof addressSchema>;

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Description is too short'),
  categoryId: z.string().min(1, 'Select a category'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  mrp: z.coerce.number().positive('MRP must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  material: z.enum(['GOLD_PLATED', 'SILVER', 'ARTIFICIAL', 'BRASS']),
  occasion: z.enum(['WEDDING', 'FESTIVE', 'DAILY_WEAR', 'PARTY', 'OFFICE', 'GIFTING']),
  color: z.string().min(2, 'Color is required'),
  weightGrams: z.coerce.number().min(0, 'Weight cannot be negative'),
  stoneType: z.string().optional(),
  supplierName: z.string().optional(),
  supplierUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  costPrice: z.coerce.number().min(0).optional(),
  featured: z.boolean(),
  trending: z.boolean(),
  bestSeller: z.boolean(),
  newArrival: z.boolean(),
  active: z.boolean(),
});
export type ProductForm = z.infer<typeof productSchema>;

export const couponSchema = z.object({
  code: z.string().min(3, 'Code is required').toUpperCase(),
  description: z.string().min(3, 'Description is required'),
  type: z.enum(['PERCENT', 'FLAT']),
  value: z.coerce.number().positive('Value must be greater than 0'),
  minOrderAmount: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(0).optional(),
  expiresAt: z.string().min(1, 'Expiry date is required'),
  usageLimit: z.coerce.number().int().positive('Usage limit must be greater than 0'),
  active: z.boolean(),
});
export type CouponForm = z.infer<typeof couponSchema>;

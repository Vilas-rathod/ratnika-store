import type { Address, User } from '@/types';
import { http } from './http';

export interface AddressPayload {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault?: boolean;
}

export const accountService = {
  updateProfile(payload: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) {
    return http.put<User>('/users/me', payload);
  },

  listAddresses() {
    return http.get<Address[]>('/addresses');
  },

  addAddress(payload: AddressPayload) {
    return http.post<Address>('/addresses', payload);
  },

  updateAddress(id: string, payload: AddressPayload) {
    return http.put<Address>(`/addresses/${id}`, payload);
  },

  deleteAddress(id: string) {
    return http.delete<{ ok: boolean }>(`/addresses/${id}`);
  },
};

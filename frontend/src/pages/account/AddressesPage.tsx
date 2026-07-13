import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AddressFormDialog } from '@/components/account/AddressFormDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { accountService } from '@/services/account.service';

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => accountService.listAddresses(),
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) => accountService.deleteAddress(id),
    onSuccess: () => {
      toast.success('Address removed');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (addr: Address) => {
    setEditing(addr);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Saved Addresses</h1>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-medium">{addr.fullName}</span>
                  <Badge variant="secondary">{addr.type}</Badge>
                  {addr.isDefault && <Badge variant="gold">Default</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{addr.phone}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAddress.mutate(addr.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add a delivery address to speed up checkout."
          action={<Button onClick={openAdd}>Add Address</Button>}
        />
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['addresses'] })}
      />
    </div>
  );
}

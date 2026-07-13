import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: 'primary' | 'success' | 'info' | 'warning';
}

const accentMap = {
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-[var(--success-soft)] text-[var(--success)]',
  info: 'bg-[var(--info-soft)] text-[var(--info)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
};

export function StatCard({ label, value, icon: Icon, hint, accent = 'primary' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={cn('flex h-12 w-12 items-center justify-center rounded-lg', accentMap[accent])}>
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

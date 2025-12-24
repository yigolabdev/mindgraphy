'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, icon: Icon, children, className }: FormSectionProps) {
  return (
    <Card className={cn("border-2 border-zinc-200", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-medium text-zinc-900">
          {Icon && <Icon className="w-5 h-5 text-zinc-600" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}

'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  icon: Icon,
  className,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-zinc-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
      />
    </div>
  );
}

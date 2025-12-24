'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface YesNoFieldProps {
  id: string;
  label: string;
  value: 'yes' | 'no' | '';
  onChange: (value: 'yes' | 'no') => void;
  required?: boolean;
  className?: string;
}

export function YesNoField({ id, label, value, onChange, required, className }: YesNoFieldProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as 'yes' | 'no')}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${id}-yes`} />
          <Label htmlFor={`${id}-yes`} className="font-normal cursor-pointer">
            예
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${id}-no`} />
          <Label htmlFor={`${id}-no`} className="font-normal cursor-pointer">
            아니오
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

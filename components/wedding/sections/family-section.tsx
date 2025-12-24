'use client';

import { FormSection } from '@/components/wedding/form-section';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WeddingFamily } from '@/lib/types/wedding-details';
import { Users } from 'lucide-react';

interface FamilySectionProps {
  data: WeddingFamily;
  onChange: <K extends keyof WeddingFamily>(field: K, value: WeddingFamily[K]) => void;
}

export function FamilySection({ data, onChange }: FamilySectionProps) {
  return (
    <FormSection title="가족 구성원" icon={Users}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-700">신랑 측 가족</Label>
          <Textarea
            value={data.groomFamily}
            onChange={(e) => onChange('groomFamily', e.target.value)}
            placeholder="예: 부모님, 형, 여동생"
            className="min-h-[80px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-700">신부 측 가족</Label>
          <Textarea
            value={data.brideFamily}
            onChange={(e) => onChange('brideFamily', e.target.value)}
            placeholder="예: 부모님, 언니, 남동생"
            className="min-h-[80px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
          />
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <p className="text-xs text-zinc-600 leading-relaxed font-light">
            💡 가족사진 촬영 시 구성원 파악에 도움이 됩니다
          </p>
        </div>
      </div>
    </FormSection>
  );
}

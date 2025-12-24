'use client';

import { FormSection } from '@/components/wedding/form-section';
import { TextField } from '@/components/wedding/text-field';
import { WeddingHoneymoon } from '@/lib/types/wedding-details';
import { Plane } from 'lucide-react';

interface HoneymoonSectionProps {
  data: WeddingHoneymoon;
  onChange: <K extends keyof WeddingHoneymoon>(field: K, value: WeddingHoneymoon[K]) => void;
}

export function HoneymoonSection({ data, onChange }: HoneymoonSectionProps) {
  return (
    <FormSection title="허니문 일정" icon={Plane}>
      <div className="grid md:grid-cols-3 gap-4">
        <TextField
          id="honeymoon-departure"
          label="출발일"
          type="date"
          value={data.departure}
          onChange={(value) => onChange('departure', value)}
        />

        <TextField
          id="honeymoon-destination"
          label="목적지"
          value={data.destination}
          onChange={(value) => onChange('destination', value)}
          placeholder="예: 몰디브"
        />

        <TextField
          id="honeymoon-return"
          label="귀국일"
          type="date"
          value={data.return}
          onChange={(value) => onChange('return', value)}
        />
      </div>

      <div className="bg-zinc-50 border border-zinc-200 p-4">
        <p className="text-xs text-zinc-600 leading-relaxed font-light">
          💡 허니문 일정을 알려주시면 결과물 전달 일정 조율에 도움이 됩니다
        </p>
      </div>
    </FormSection>
  );
}

'use client';

import { FormSection } from '@/components/wedding/form-section';
import { TextField } from '@/components/wedding/text-field';
import { WeddingTimeTable } from '@/lib/types/wedding-details';
import { Clock } from 'lucide-react';

interface TimeTableSectionProps {
  data: WeddingTimeTable;
  onChange: <K extends keyof WeddingTimeTable>(field: K, value: WeddingTimeTable[K]) => void;
}

export function TimeTableSection({ data, onChange }: TimeTableSectionProps) {
  return (
    <FormSection title="메이크업 타임테이블" icon={Clock}>
      <div className="grid md:grid-cols-3 gap-6">
        <TextField
          id="makeup-shop"
          label="메이크업샵 이름"
          value={data.makeupShop}
          onChange={(value) => onChange('makeupShop', value)}
          placeholder="예: 청담 메이크업"
        />

        <TextField
          id="makeup-start"
          label="메이크업 시작 시간"
          type="time"
          value={data.makeupStartTime}
          onChange={(value) => onChange('makeupStartTime', value)}
        />

        <TextField
          id="makeup-end"
          label="메이크업 종료 시간"
          type="time"
          value={data.makeupEndTime}
          onChange={(value) => onChange('makeupEndTime', value)}
        />
      </div>

      <div className="bg-zinc-50 border border-zinc-200 p-4">
        <p className="text-xs text-zinc-600 leading-relaxed font-light">
          💡 정확한 메이크업 시간을 입력하시면, 작가님이 최적의 도착 시간을 계산할 수 있습니다
        </p>
      </div>
    </FormSection>
  );
}

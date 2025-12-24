'use client';

import { FormSection } from '@/components/wedding/form-section';
import { TextField } from '@/components/wedding/text-field';
import { WeddingStyling } from '@/lib/types/wedding-details';
import { Sparkles } from 'lucide-react';

interface StylingSectionProps {
  data: WeddingStyling;
  onChange: <K extends keyof WeddingStyling>(field: K, value: WeddingStyling[K]) => void;
}

export function StylingSection({ data, onChange }: StylingSectionProps) {
  return (
    <FormSection title="스타일링 정보" icon={Sparkles}>
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-900">본식 드레스</h4>
          <div className="grid md:grid-cols-2 gap-4 pl-4 border-l-2 border-zinc-200">
            <TextField
              id="main-dress-color"
              label="색상"
              value={data.mainDressColor}
              onChange={(value) => onChange('mainDressColor', value)}
              placeholder="예: 아이보리"
            />
            <TextField
              id="main-dress-style"
              label="스타일"
              value={data.mainDressStyle}
              onChange={(value) => onChange('mainDressStyle', value)}
              placeholder="예: A라인, 프린세스"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-zinc-900">피로연 드레스</h4>
          <div className="grid md:grid-cols-2 gap-4 pl-4 border-l-2 border-zinc-200">
            <TextField
              id="reception-dress-color"
              label="색상"
              value={data.receptionDressColor}
              onChange={(value) => onChange('receptionDressColor', value)}
              placeholder="예: 핑크"
            />
            <TextField
              id="reception-dress-style"
              label="스타일"
              value={data.receptionDressStyle}
              onChange={(value) => onChange('receptionDressStyle', value)}
              placeholder="예: 슬림, 머메이드"
            />
          </div>
        </div>

        <TextField
          id="groom-suit"
          label="신랑 정장 정보"
          value={data.groomSuitInfo}
          onChange={(value) => onChange('groomSuitInfo', value)}
          placeholder="예: 네이비 슈트, 보타이"
        />

        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <p className="text-xs text-zinc-600 leading-relaxed font-light">
            💡 드레스와 정장 색상을 미리 알면 배경 및 조명 설정에 도움이 됩니다
          </p>
        </div>
      </div>
    </FormSection>
  );
}

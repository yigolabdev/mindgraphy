'use client';

import { FormSection } from '@/components/wedding/form-section';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WeddingPhotoStyle } from '@/lib/types/wedding-details';
import { Camera } from 'lucide-react';

interface PhotoStyleSectionProps {
  data: WeddingPhotoStyle;
  onChange: <K extends keyof WeddingPhotoStyle>(field: K, value: WeddingPhotoStyle[K]) => void;
}

export function PhotoStyleSection({ data, onChange }: PhotoStyleSectionProps) {
  return (
    <FormSection title="사진 방향" icon={Camera}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-700">선호하는 스타일</Label>
          <Textarea
            value={data.preferredStyle}
            onChange={(e) => onChange('preferredStyle', e.target.value)}
            placeholder="원하시는 사진 스타일, 분위기, 레퍼런스가 있다면 알려주세요"
            className="min-h-[100px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-700">선호하지 않는 스타일</Label>
          <Textarea
            value={data.notPreferredStyle}
            onChange={(e) => onChange('notPreferredStyle', e.target.value)}
            placeholder="원하지 않는 포즈나 스타일이 있다면 알려주세요"
            className="min-h-[100px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
          />
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <p className="text-xs text-zinc-600 leading-relaxed font-light">
            💡 구체적으로 작성하실수록 원하시는 결과물을 얻으실 수 있습니다
          </p>
        </div>
      </div>
    </FormSection>
  );
}

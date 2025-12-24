'use client';

import { FormSection } from '@/components/wedding/form-section';
import { YesNoField } from '@/components/wedding/yes-no-field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WeddingCeremony, MCType } from '@/lib/types/wedding-details';
import { Heart } from 'lucide-react';

interface CeremonySectionProps {
  data: WeddingCeremony;
  onChange: <K extends keyof WeddingCeremony>(field: K, value: WeddingCeremony[K]) => void;
}

export function CeremonySection({ data, onChange }: CeremonySectionProps) {
  return (
    <FormSection title="예식 진행 내용" icon={Heart}>
      <div className="space-y-6">
        <YesNoField
          id="pre-ceremony-photo"
          label="예식 전 스냅 촬영"
          value={data.hasPreCeremonyPhoto}
          onChange={(value) => onChange('hasPreCeremonyPhoto', value)}
        />

        <YesNoField
          id="officiant"
          label="주례 유무"
          value={data.hasOfficiant}
          onChange={(value) => onChange('hasOfficiant', value)}
        />

        <YesNoField
          id="mc"
          label="사회자 유무"
          value={data.hasMC}
          onChange={(value) => onChange('hasMC', value)}
        />

        {data.hasMC === 'yes' && (
          <div className="space-y-3 pl-6 border-l-2 border-zinc-200">
            <Label className="text-sm font-medium text-zinc-700">사회자 유형</Label>
            <RadioGroup
              value={data.mcType}
              onValueChange={(value) => onChange('mcType', value as MCType)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="mc-professional" />
                <Label htmlFor="mc-professional" className="font-normal cursor-pointer">
                  전문 사회자
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friend" id="mc-friend" />
                <Label htmlFor="mc-friend" className="font-normal cursor-pointer">
                  지인 사회
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <YesNoField
          id="ring-exchange"
          label="반지 교환"
          value={data.hasRingExchange}
          onChange={(value) => onChange('hasRingExchange', value)}
        />

        <YesNoField
          id="flower-girl"
          label="플라워 걸 / 링 베어러"
          value={data.hasFlowerGirl}
          onChange={(value) => onChange('hasFlowerGirl', value)}
        />

        <YesNoField
          id="paebaek"
          label="폐백 촬영"
          value={data.hasPaebaek}
          onChange={(value) => onChange('hasPaebaek', value)}
        />
      </div>
    </FormSection>
  );
}

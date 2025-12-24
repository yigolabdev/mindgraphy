'use client';

import { FormSection } from '@/components/wedding/form-section';
import { TextField } from '@/components/wedding/text-field';
import { WeddingVendors } from '@/lib/types/wedding-details';
import { Briefcase } from 'lucide-react';

interface VendorsSectionProps {
  data: WeddingVendors;
  onChange: <K extends keyof WeddingVendors>(field: K, value: WeddingVendors[K]) => void;
}

export function VendorsSection({ data, onChange }: VendorsSectionProps) {
  return (
    <FormSection title="협력 업체 정보" icon={Briefcase}>
      <div className="space-y-4">
        <TextField
          id="dress-shop"
          label="드레스샵"
          value={data.dressShop}
          onChange={(value) => onChange('dressShop', value)}
          placeholder="드레스샵 이름"
        />

        <TextField
          id="suit-shop"
          label="예복점"
          value={data.suitShop}
          onChange={(value) => onChange('suitShop', value)}
          placeholder="예복점 이름"
        />

        <TextField
          id="makeup-shop"
          label="메이크업샵"
          value={data.makeupShop}
          onChange={(value) => onChange('makeupShop', value)}
          placeholder="메이크업샵 이름"
        />

        <TextField
          id="planner"
          label="웨딩 플래너"
          value={data.planner}
          onChange={(value) => onChange('planner', value)}
          placeholder="플래너 업체 이름"
        />

        <TextField
          id="video-team"
          label="영상팀"
          value={data.videoTeam}
          onChange={(value) => onChange('videoTeam', value)}
          placeholder="영상팀 업체 이름"
        />

        <TextField
          id="iphone-snap"
          label="아이폰 스냅"
          value={data.iphoneSnap}
          onChange={(value) => onChange('iphoneSnap', value)}
          placeholder="아이폰 스냅 업체 이름"
        />

        <TextField
          id="other-team"
          label="기타 협력 업체"
          value={data.otherTeam}
          onChange={(value) => onChange('otherTeam', value)}
          placeholder="기타 업체 정보"
        />

        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <p className="text-xs text-zinc-600 leading-relaxed font-light">
            💡 협력 업체 정보를 공유하면 현장에서 원활한 소통이 가능합니다
          </p>
        </div>
      </div>
    </FormSection>
  );
}

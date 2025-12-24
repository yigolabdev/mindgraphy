'use client';

import { FormSection } from '@/components/wedding/form-section';
import { TextField } from '@/components/wedding/text-field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MeetingType } from '@/lib/types/wedding-details';
import { MessageSquare, Link as LinkIcon } from 'lucide-react';

interface MeetingSectionProps {
  meetingType: MeetingType;
  invitationUrl: string;
  onMeetingTypeChange: (value: MeetingType) => void;
  onInvitationUrlChange: (value: string) => void;
}

export function MeetingSection({
  meetingType,
  invitationUrl,
  onMeetingTypeChange,
  onInvitationUrlChange,
}: MeetingSectionProps) {
  return (
    <>
      <FormSection title="작가님과의 미팅" icon={MessageSquare}>
        <div className="space-y-4">
          <Label className="text-sm font-medium text-zinc-700">미팅 방식</Label>
          <RadioGroup
            value={meetingType}
            onValueChange={(value) => onMeetingTypeChange(value as MeetingType)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2 p-3 border-2 border-zinc-200 rounded">
              <RadioGroupItem value="direct" id="meeting-direct" />
              <Label htmlFor="meeting-direct" className="font-normal cursor-pointer flex-1">
                직접 만나서 상담하고 싶어요
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border-2 border-zinc-200 rounded">
              <RadioGroupItem value="phone" id="meeting-phone" />
              <Label htmlFor="meeting-phone" className="font-normal cursor-pointer flex-1">
                전화로 상담하고 싶어요
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border-2 border-zinc-200 rounded">
              <RadioGroupItem value="list" id="meeting-list" />
              <Label htmlFor="meeting-list" className="font-normal cursor-pointer flex-1">
                특별한 요청사항만 전달하고 작가님께 맡기고 싶어요
              </Label>
            </div>
          </RadioGroup>

          <div className="bg-zinc-50 border border-zinc-200 p-4">
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              💡 촬영 1-2주 전에 작가님이 연락드려 최종 확인을 진행합니다
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection title="모바일 청첩장" icon={LinkIcon}>
        <TextField
          id="invitation-url"
          label="청첩장 URL"
          type="url"
          value={invitationUrl}
          onChange={onInvitationUrlChange}
          placeholder="https://..."
        />

        <div className="bg-zinc-50 border border-zinc-200 p-4">
          <p className="text-xs text-zinc-600 leading-relaxed font-light">
            💡 모바일 청첩장이 있다면 링크를 공유해주세요. 예식장 위치, 시간 확인에 도움이 됩니다
          </p>
        </div>
      </FormSection>
    </>
  );
}

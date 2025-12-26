'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useWeddingDetailsForm } from '@/hooks/use-wedding-details-form';
import {
  saveWeddingDetailsDraft,
  loadWeddingDetailsDraft,
  clearWeddingDetailsDraft,
} from '@/lib/utils/wedding-details.utils';
import { TimeTableSection } from '@/components/wedding/sections/timetable-section';
import { CeremonySection } from '@/components/wedding/sections/ceremony-section';
import { FamilySection } from '@/components/wedding/sections/family-section';
import { PhotoStyleSection } from '@/components/wedding/sections/photo-style-section';
import { StylingSection } from '@/components/wedding/sections/styling-section';
import { VendorsSection } from '@/components/wedding/sections/vendors-section';
import { HoneymoonSection } from '@/components/wedding/sections/honeymoon-section';
import { MeetingSection } from '@/components/wedding/sections/meeting-section';

export default function WeddingDetailsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { formData, setFormData, updateField, updateNestedField } = useWeddingDetailsForm();

  // Load saved draft on mount
  useEffect(() => {
    setIsMounted(true);
    const savedDraft = loadWeddingDetailsDraft();
    if (savedDraft) {
      setFormData(savedDraft);
      toast.success('저장된 정보를 불러왔습니다');
    }
  }, [setFormData]);

  // Auto-save draft
  const saveDraft = useCallback(() => {
    setIsSaving(true);
    saveWeddingDetailsDraft(formData);
    toast.success('임시 저장되었습니다', { duration: 2000 });
    setTimeout(() => setIsSaving(false), 1000);
  }, [formData]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!formData.timeConfirmed) {
      toast.error('촬영 시간 확인에 동의해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API call to submit form
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear draft after successful submission
      clearWeddingDetailsDraft();

      toast.success('예식 상세 정보가 저장되었습니다');
      router.push('/c/portal');
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          <p className="text-sm text-zinc-600 font-light">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-white transition-all duration-1000 ease-out',
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      {/* Header */}
      <div className="border-b border-zinc-200 sticky top-0 z-10 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </button>

            <Button
              onClick={saveDraft}
              variant="outline"
              size="sm"
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '저장 중...' : '임시 저장'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
              예식 상세 정보 입력
            </h1>
            <p className="text-base text-zinc-600 leading-relaxed font-light">
              촬영에 필요한 정보를 상세히 입력해주세요
              <br />
              입력하신 정보는 더 나은 촬영을 위해 사용됩니다
            </p>
            
            {/* 30일 이전 작성 안내 */}
            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg max-w-xl mx-auto mt-6">
              <p className="text-sm text-amber-900 font-medium leading-relaxed">
                ⏰ 예식일 기준 <span className="font-bold text-amber-700">30일 이전</span>까지 작성해 주세요
              </p>
              <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                충분한 준비 시간을 위해 가급적 빠른 작성을 부탁드립니다
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* Form Sections */}
          <div className="space-y-8">
            <TimeTableSection
              data={formData.timetable}
              onChange={(field, value) => updateNestedField('timetable', field, value)}
            />

            <CeremonySection
              data={formData.ceremony}
              onChange={(field, value) => updateNestedField('ceremony', field, value)}
            />

            <FamilySection
              data={formData.family}
              onChange={(field, value) => updateNestedField('family', field, value)}
            />

            <PhotoStyleSection
              data={formData.photoStyle}
              onChange={(field, value) => updateNestedField('photoStyle', field, value)}
            />

            <StylingSection
              data={formData.styling}
              onChange={(field, value) => updateNestedField('styling', field, value)}
            />

            <VendorsSection
              data={formData.vendors}
              onChange={(field, value) => updateNestedField('vendors', field, value)}
            />

            {/* Special Events & Requests */}
            <div className="space-y-6 bg-zinc-50 border-2 border-zinc-200 p-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">특별 이벤트</Label>
                <Textarea
                  value={formData.specialEvents}
                  onChange={(e) => updateField('specialEvents', e.target.value)}
                  placeholder="서프라이즈 이벤트, 특별 공연 등이 있다면 알려주세요"
                  className="min-h-[100px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">특별 요청사항</Label>
                <Textarea
                  value={formData.specialRequests}
                  onChange={(e) => updateField('specialRequests', e.target.value)}
                  placeholder="작가님께 전달하고 싶은 특별한 요청사항이 있다면 자유롭게 작성해주세요"
                  className="min-h-[120px] resize-none border-2 border-zinc-200 focus:border-zinc-900"
                />
              </div>
            </div>

            <HoneymoonSection
              data={formData.honeymoon}
              onChange={(field, value) => updateNestedField('honeymoon', field, value)}
            />

            <MeetingSection
              meetingType={formData.meetingType}
              invitationUrl={formData.invitationUrl}
              onMeetingTypeChange={(value) => updateField('meetingType', value)}
              onInvitationUrlChange={(value) => updateField('invitationUrl', value)}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* Time Confirmation */}
          <div className="bg-amber-50 border-2 border-amber-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="time-confirmed"
                checked={formData.timeConfirmed}
                onCheckedChange={(checked) => updateField('timeConfirmed', checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="time-confirmed" className="cursor-pointer text-sm leading-relaxed">
                <span className="font-medium text-amber-900">
                  촬영 시간 확인 및 동의 (필수)
                </span>
                <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                  입력하신 정보를 바탕으로 작가님이 당일 타임테이블을 작성합니다.
                  <br />
                  촬영 3일 전까지 최종 타임테이블을 확인하시고 문제가 없으시면 동의해주세요.
                </p>
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.timeConfirmed}
              className="flex-1 h-14 text-base font-normal bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Upload className="w-5 h-5 mr-2" />
              {isSubmitting ? '제출 중...' : '정보 제출하기'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-xs text-zinc-500 leading-relaxed">
              입력하신 정보는 안전하게 보호되며, 촬영 진행에만 사용됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

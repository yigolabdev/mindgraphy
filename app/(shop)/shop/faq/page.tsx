"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const faqs = [
    {
      category: "주문 및 결제",
      items: [
        {
          question: "온라인으로 어떻게 주문하나요?",
          answer: "원하시는 상품을 선택하여 장바구니에 담은 후, 주문 정보를 입력하시고 결제를 진행하시면 됩니다. 결제 완료 후 영업일 기준 1-2일 내에 담당자가 연락드려 상세 일정을 조율합니다.",
        },
        {
          question: "어떤 결제 방법을 사용할 수 있나요?",
          answer: "신용카드, 체크카드, 계좌이체, 무통장입금 등 다양한 결제 방법을 지원합니다. 모든 결제는 안전한 전자결제 시스템을 통해 진행됩니다.",
        },
        {
          question: "계약금과 잔금은 어떻게 나뉘나요?",
          answer: "일반적으로 계약금 50%, 잔금 50%로 진행됩니다. 계약금은 주문 시 결제하시고, 잔금은 촬영 완료 후 결제하시면 됩니다.",
        },
      ],
    },
    {
      category: "촬영 관련",
      items: [
        {
          question: "촬영은 언제 진행되나요?",
          answer: "주문 후 고객님과 협의하여 촬영 일정을 결정합니다. 주말과 공휴일은 예약이 많으므로 최소 2-3개월 전에 예약하시는 것을 권장드립니다.",
        },
        {
          question: "촬영 장소는 어디인가요?",
          answer: "웨딩 촬영의 경우 예식장에서 진행됩니다. 스냅 촬영은 원하시는 장소를 선택하실 수 있으며, 추천 장소도 안내해드립니다.",
        },
        {
          question: "촬영 시간은 얼마나 걸리나요?",
          answer: "패키지에 따라 다르지만, 웨딩 촬영은 보통 4-6시간, 스냅 촬영은 2-3시간 정도 소요됩니다.",
        },
        {
          question: "날씨가 안 좋으면 어떻게 하나요?",
          answer: "기상 악화 등 불가항력적인 상황에서는 일정 조정이 가능합니다. 촬영 전날 담당자와 협의하여 일정을 변경할 수 있습니다.",
        },
      ],
    },
    {
      category: "결과물",
      items: [
        {
          question: "사진은 언제 받을 수 있나요?",
          answer: "촬영 후 약 2-3주 내에 전체 사진을 확인하실 수 있으며, 선택 및 보정 완료 후 약 1-2주 내에 최종 결과물을 받으실 수 있습니다.",
        },
        {
          question: "사진 보정은 어떻게 진행되나요?",
          answer: "전문 보정팀이 색감 보정, 피부 보정, 배경 정리 등 기본 보정을 진행합니다. 추가 보정이 필요한 경우 별도 비용으로 가능합니다.",
        },
        {
          question: "원본 사진도 받을 수 있나요?",
          answer: "선택하신 사진에 대해서는 보정된 고해상도 파일과 함께 원본도 제공됩니다.",
        },
      ],
    },
    {
      category: "환불 및 취소",
      items: [
        {
          question: "환불이 가능한가요?",
          answer: "촬영 7일 전까지는 100% 환불이 가능합니다. 촬영 3-7일 전은 50%, 3일 이내는 환불이 불가능합니다. 단, 고객님의 귀책사유가 아닌 경우는 예외입니다.",
        },
        {
          question: "일정 변경은 가능한가요?",
          answer: "고객님의 사정으로 인한 일정 변경은 최대 2회까지 가능합니다. 기상 악화 등 불가항력적인 사유는 제한 없이 조정 가능합니다.",
        },
      ],
    },
    {
      category: "기타",
      items: [
        {
          question: "추가 옵션은 어떻게 신청하나요?",
          answer: "상품 페이지에서 원하시는 옵션을 선택하여 함께 주문하실 수 있습니다. 촬영 전까지는 추가 옵션 신청이 가능합니다.",
        },
        {
          question: "작가님을 직접 선택할 수 있나요?",
          answer: "추가 옵션으로 대표작가 지정, 수석작가 지정이 가능합니다. 특정 작가 선택을 원하시는 경우 별도 문의 부탁드립니다.",
        },
      ],
    },
  ];

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* 페이지 헤더 */}
      <div className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-light text-zinc-900 tracking-tight">
              자주 묻는 질문
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              고객님들이 자주 문의하시는 내용을 정리했습니다
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((category, categoryIdx) => (
            <div key={categoryIdx} className="space-y-6">
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
                {category.category}
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.items.map((faq, itemIdx) => (
                  <AccordionItem 
                    key={itemIdx} 
                    value={`${categoryIdx}-${itemIdx}`}
                    className="border-2 border-zinc-200 px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-zinc-900 hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-600 leading-relaxed font-light pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-zinc-200 pt-12"></div>

          {/* 추가 문의 안내 */}
          <div className="text-center space-y-6 bg-zinc-50 border-2 border-zinc-200 p-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-light text-zinc-900 tracking-tight">
                원하시는 답변을 찾지 못하셨나요?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                언제든지 문의해 주세요. 빠르고 정확하게 답변드리겠습니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="text-center">
                <p className="text-xs text-zinc-500 font-light mb-1">전화 문의</p>
                <p className="text-lg font-medium text-zinc-900">1588-0000</p>
                <p className="text-xs text-zinc-500 font-light">평일 09:00 - 18:00</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-zinc-200"></div>
              <div className="text-center">
                <p className="text-xs text-zinc-500 font-light mb-1">이메일 문의</p>
                <p className="text-lg font-medium text-zinc-900">support@mindgraphy.com</p>
                <p className="text-xs text-zinc-500 font-light">24시간 접수 가능</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

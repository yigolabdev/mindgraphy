"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    // TODO: 실제 API 호출
    toast.success("문의가 성공적으로 접수되었습니다. 영업일 기준 1-2일 내에 답변드리겠습니다.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

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
              1:1 문의
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              궁금하신 점이 있으시면 언제든지 문의해 주세요
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            {/* 연락처 정보 */}
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
                  연락처
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-zinc-700" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 font-light mb-2">전화</p>
                      <p className="text-base font-medium text-zinc-900">1588-0000</p>
                      <p className="text-sm text-zinc-600 font-light mt-1">평일 09:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-zinc-700" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 font-light mb-2">이메일</p>
                      <p className="text-base font-medium text-zinc-900">support@mindgraphy.com</p>
                      <p className="text-sm text-zinc-600 font-light mt-1">24시간 접수 가능</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-zinc-700" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 font-light mb-2">주소</p>
                      <p className="text-base font-medium text-zinc-900 leading-relaxed">
                        서울특별시 성동구<br />마조로15길 6, 1층 (마장동)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-zinc-700" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 font-light mb-2">운영 시간</p>
                      <p className="text-base font-medium text-zinc-900">평일 09:00 - 18:00</p>
                      <p className="text-sm text-zinc-600 font-light mt-1">주말 및 공휴일 휴무</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-200">
                <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-3">
                  <h3 className="text-sm font-medium text-zinc-900">답변 시간 안내</h3>
                  <ul className="space-y-2 text-xs text-zinc-600 font-light leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>영업일 기준 1-2일 내에 답변드립니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>주말 및 공휴일에는 답변이 지연될 수 있습니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>긴급 문의는 전화로 연락 부탁드립니다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 문의 폼 */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="홍길동"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-zinc-700">
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-zinc-700">
                    제목
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="문의 제목을 입력해주세요"
                    className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-zinc-700">
                    문의 내용 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="문의하실 내용을 상세히 입력해주세요"
                    className="min-h-[200px] resize-none border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                    required
                  />
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-4">
                  <p className="text-xs text-zinc-600 font-light leading-relaxed">
                    <span className="font-medium text-zinc-700">개인정보 수집 및 이용 안내:</span><br />
                    문의 처리를 위해 이름, 이메일, 연락처를 수집하며, 
                    문의 처리 완료 후 즉시 파기됩니다. 
                    개인정보 제공에 동의하시는 경우에만 문의가 접수됩니다.
                  </p>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-base font-normal bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  문의 접수
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

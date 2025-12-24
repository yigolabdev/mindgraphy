"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    // 실제로는 서버로 전송
    toast.success("문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">1:1 문의</CardTitle>
            <p className="text-sm text-gray-600">궁금한 사항을 남겨주시면 빠르게 답변드리겠습니다</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* 연락처 정보 */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">연락처</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">전화</p>
                        <p className="font-semibold">1588-0000</p>
                        <p className="text-xs text-gray-500">평일 09:00 - 18:00</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">이메일</p>
                        <p className="font-semibold text-sm">support@mindgraphy.com</p>
                        <p className="text-xs text-gray-500">24시간 이내 답변</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>답변 시간:</strong><br />
                    평일 기준 24시간 이내에 답변드립니다.
                    주말 및 공휴일 문의는 다음 영업일에 순차적으로 처리됩니다.
                  </p>
                </div>
              </div>

              {/* 문의 폼 */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">제목</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="문의 제목을 입력해주세요"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">문의 내용 *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="문의하실 내용을 상세히 작성해주세요"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>개인정보 수집 및 이용 안내</strong><br />
                      문의 접수 및 답변을 위해 위 정보를 수집하며, 
                      문의 처리 후 즉시 파기됩니다.
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="mr-2 w-5 h-5" />
                    문의하기
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

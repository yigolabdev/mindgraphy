'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Step = 'year' | 'month' | 'day' | 'time'

export default function WeddingDatePage() {
  const router = useRouter()
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const [currentStep, setCurrentStep] = useState<Step>('year')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [stepTransition, setStepTransition] = useState(false)
  const [productType, setProductType] = useState<string>('wedding')
  const [customTimeMode, setCustomTimeMode] = useState(false)
  const [customHour, setCustomHour] = useState<number | null>(null)
  const [customMinute, setCustomMinute] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Load product type from session
    if (typeof window !== 'undefined') {
      const type = sessionStorage.getItem('mindgraphy_product_type') || 'wedding'
      setProductType(type)
    }
  }, [])

  // Generate years (current year + next 2 years)
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1, currentYear + 2]

  // Generate months
  const months = [
    { value: 1, label: '1월' },
    { value: 2, label: '2월' },
    { value: 3, label: '3월' },
    { value: 4, label: '4월' },
    { value: 5, label: '5월' },
    { value: 6, label: '6월' },
    { value: 7, label: '7월' },
    { value: 8, label: '8월' },
    { value: 9, label: '9월' },
    { value: 10, label: '10월' },
    { value: 11, label: '11월' },
    { value: 12, label: '12월' },
  ]

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const days = selectedYear && selectedMonth
    ? Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1)
    : []

  // Time slots based on product type
  const timeSlots = productType === 'hanbok' 
    ? [
        { value: '오전 촬영', label: '오전 촬영 (B-1)' },
        { value: '일몰 촬영', label: '일몰 시간대 촬영 (B-2)' },
      ]
    : [
        { value: '11:00', label: '오전 11시' },
        { value: '11:30', label: '오전 11시 30분' },
        { value: '12:00', label: '낮 12시' },
        { value: '12:30', label: '낮 12시 30분' },
        { value: '13:00', label: '오후 1시' },
        { value: '13:30', label: '오후 1시 30분' },
        { value: '14:00', label: '오후 2시' },
        { value: '14:30', label: '오후 2시 30분' },
        { value: '15:00', label: '오후 3시' },
        { value: '15:30', label: '오후 3시 30분' },
        { value: '16:00', label: '오후 4시' },
        { value: '16:30', label: '오후 4시 30분' },
        { value: '17:00', label: '오후 5시' },
        { value: '17:30', label: '오후 5시 30분' },
        { value: '18:00', label: '오후 6시' },
      ]

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setStepTransition(true)
    setTimeout(() => {
      setCurrentStep('month')
      setStepTransition(false)
    }, 300)
  }

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    setStepTransition(true)
    setTimeout(() => {
      setCurrentStep('day')
      setStepTransition(false)
    }, 300)
  }

  const handleDaySelect = (day: number) => {
    setSelectedDay(day)
    setStepTransition(true)
    setTimeout(() => {
      setCurrentStep('time')
      setStepTransition(false)
    }, 300)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCustomTimeMode(false)
    setCustomHour(null)
    setCustomMinute(null)
    
    // Scroll to next button and focus
    setTimeout(() => {
      nextButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      nextButtonRef.current?.focus()
    }, 100)
  }

  const handleCustomTimeToggle = () => {
    setCustomTimeMode(true)
    setSelectedTime(null)
  }

  const handleCustomHourSelect = (hour: number) => {
    setCustomHour(hour)
    if (customMinute !== null) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(customMinute).padStart(2, '0')}`
      setSelectedTime(timeStr)
      
      // Scroll to next button and focus
      setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        nextButtonRef.current?.focus()
      }, 100)
    }
  }

  const handleCustomMinuteSelect = (minute: number) => {
    setCustomMinute(minute)
    if (customHour !== null) {
      const timeStr = `${String(customHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      setSelectedTime(timeStr)
      
      // Scroll to next button and focus
      setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        nextButtonRef.current?.focus()
      }, 100)
    }
  }

  const formatCustomTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const h = parseInt(hour)
    const m = parseInt(minute)
    
    if (h < 12) {
      return `오전 ${h}시${m > 0 ? ` ${m}분` : ''}`
    } else if (h === 12) {
      return `낮 12시${m > 0 ? ` ${m}분` : ''}`
    } else {
      return `오후 ${h - 12}시${m > 0 ? ` ${m}분` : ''}`
    }
  }

  const handleBack = () => {
    if (currentStep === 'time') {
      if (customTimeMode) {
        // If in custom time mode, go back to normal time selection
        setCustomTimeMode(false)
        setCustomHour(null)
        setCustomMinute(null)
        setSelectedTime(null)
      } else {
        // Otherwise, go back to day selection
        setStepTransition(true)
        setSelectedTime(null)
        setCustomTimeMode(false)
        setCustomHour(null)
        setCustomMinute(null)
        setTimeout(() => {
          setCurrentStep('day')
          setStepTransition(false)
        }, 300)
      }
    } else if (currentStep === 'day') {
      setStepTransition(true)
      setSelectedDay(null)
      setTimeout(() => {
        setCurrentStep('month')
        setStepTransition(false)
      }, 300)
    } else if (currentStep === 'month') {
      setStepTransition(true)
      setSelectedMonth(null)
      setTimeout(() => {
        setCurrentStep('year')
        setStepTransition(false)
      }, 300)
    } else {
      // Go back to previous page based on product type
      setIsAnimating(true)
      setTimeout(() => {
        const previousPage = productType === 'wedding' ? '/c/process' : '/c/product-type'
        router.push(previousPage)
      }, 200)
    }
  }

  const handleUndecided = (fromStep: Step) => {
    setIsAnimating(true)

    // Store the undecided information
    if (typeof window !== 'undefined') {
      let dateInfo = ''
      
      if (fromStep === 'year') {
        dateInfo = '미정'
      } else if (fromStep === 'month' && selectedYear) {
        dateInfo = `${selectedYear}년 미정`
      } else if (fromStep === 'day' && selectedYear && selectedMonth) {
        dateInfo = `${selectedYear}년 ${selectedMonth}월 미정`
      } else if (fromStep === 'time' && selectedYear && selectedMonth && selectedDay) {
        const weddingDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        sessionStorage.setItem('mindgraphy_wedding_date', weddingDate)
        sessionStorage.setItem('mindgraphy_wedding_time', '미정')
        dateInfo = `${selectedYear}년 ${selectedMonth}월 ${selectedDay}일 시간미정`
      }
      
      sessionStorage.setItem('mindgraphy_wedding_date_info', dateInfo)
    }

    // Navigate based on product type
    const nextPage = productType === 'hanbok' ? '/c/packages' : '/c/process'
    setTimeout(() => {
      router.push(nextPage)
    }, 200)
  }

  const handleNext = () => {
    if (!selectedYear || !selectedMonth || !selectedDay || !selectedTime) return

    setIsAnimating(true)

    // Store the date and time
    if (typeof window !== 'undefined') {
      const weddingDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
      sessionStorage.setItem('mindgraphy_wedding_date', weddingDate)
      sessionStorage.setItem('mindgraphy_wedding_time', selectedTime)
      sessionStorage.setItem('mindgraphy_wedding_date_info', '')
    }

    // Navigate based on product type (hanbok skips process page)
    const nextPage = productType === 'hanbok' ? '/c/packages' : '/c/process'
    setTimeout(() => {
      router.push(nextPage)
    }, 200)
  }

  // Get day of week
  const getDayOfWeek = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day)
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    return days[date.getDay()]
  }

  const formatSelectedDate = () => {
    if (!selectedYear) return ''
    if (!selectedMonth) return `${selectedYear}년`
    if (!selectedDay) return `${selectedYear}년 ${selectedMonth}월`
    
    const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, selectedDay)
    const dateStr = `${selectedYear}년 ${selectedMonth}월 ${selectedDay}일 ${dayOfWeek}`
    
    if (!selectedTime) return dateStr
    
    // Check if it's a custom time (HH:MM format) or a predefined time slot
    const timeLabel = timeSlots.find(slot => slot.value === selectedTime)?.label
    if (timeLabel) {
      return `${dateStr} ${timeLabel}`
    } else {
      // Custom time format
      return `${dateStr} ${formatCustomTime(selectedTime)}`
    }
  }
  
  // Check if the day is weekend
  const isWeekend = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // Sunday or Saturday
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "max-w-md w-full space-y-12 transition-all duration-700 ease-out py-8",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8",
          isAnimating && "opacity-0 -translate-y-8"
        )}
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            {productType === 'wedding' ? '예식은 언제' : '촬영은 언제'}
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            진행되시나요?
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed pt-2">
            {productType === 'hanbok' 
              ? '평일 (화·수·목) 중 원하시는 날짜를 선택해 주세요'
              : '날짜를 선택해 주세요'
            }
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Selected Date Display */}
        {selectedYear && (
          <div className="text-center py-4">
            <p className="text-lg font-medium text-zinc-900 animate-in fade-in slide-in-from-top-2 duration-300">
              {formatSelectedDate()}
            </p>
          </div>
        )}

        {/* Year Selection */}
        {currentStep === 'year' && (
          <div 
            className={cn(
              "space-y-3 transition-all duration-300",
              stepTransition ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
            )}
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "w-full p-6 text-center border-2 transition-all duration-300",
                  "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                  "active:scale-[0.99]",
                  "border-zinc-200 bg-white"
                )}
              >
                <p className="text-xl font-light text-zinc-900">
                  {year}년
                </p>
              </button>
            ))}
            
            <div className="pt-4">
              <button
                onClick={() => handleUndecided('year')}
                className={cn(
                  "w-full p-6 text-center border-2 transition-all duration-300",
                  "border-zinc-300 bg-zinc-50 hover:border-zinc-600 hover:bg-zinc-100",
                  "focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2",
                  "active:scale-[0.99]"
                )}
              >
                <p className="text-base font-normal text-zinc-600">
                  일정 미정
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Month Selection */}
        {currentStep === 'month' && (
          <div 
            className={cn(
              "space-y-4 transition-all duration-300",
              stepTransition ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
            )}
          >
            <div className="grid grid-cols-3 gap-3">
              {months.map((month) => (
                <button
                  key={month.value}
                  onClick={() => handleMonthSelect(month.value)}
                  className={cn(
                    "p-4 text-center border-2 transition-all duration-300",
                    "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                    "active:scale-[0.99]",
                    selectedMonth === month.value
                      ? "border-zinc-900 bg-zinc-50 shadow-sm"
                      : "border-zinc-200 bg-white"
                  )}
                >
                  <p className="text-base font-light text-zinc-900">
                    {month.label}
                  </p>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handleUndecided('month')}
              className={cn(
                "w-full p-4 text-center border-2 transition-all duration-300",
                "border-zinc-300 bg-zinc-50 hover:border-zinc-600 hover:bg-zinc-100",
                "focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2",
                "active:scale-[0.99]"
              )}
            >
              <p className="text-sm font-normal text-zinc-600">
                월 미정
              </p>
            </button>
          </div>
        )}

        {/* Day Selection */}
        {currentStep === 'day' && (
          <div 
            className={cn(
              "space-y-4 transition-all duration-300",
              stepTransition ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
            )}
          >
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const dayOfWeek = selectedYear && selectedMonth 
                    ? getDayOfWeek(selectedYear, selectedMonth, day).charAt(0)
                    : ''
                  const weekend = selectedYear && selectedMonth && isWeekend(selectedYear, selectedMonth, day)
                  
                  // For hanbok, only allow Tue(2), Wed(3), Thu(4)
                  const dayOfWeekNum = selectedYear && selectedMonth 
                    ? new Date(selectedYear, selectedMonth - 1, day).getDay()
                    : -1
                  const isHanbokAllowed = productType !== 'hanbok' || (dayOfWeekNum >= 2 && dayOfWeekNum <= 4)
                  
                  return (
                    <button
                      key={day}
                      onClick={() => isHanbokAllowed && handleDaySelect(day)}
                      disabled={!isHanbokAllowed}
                      className={cn(
                        "aspect-square p-2 text-center border-2 transition-all duration-300 flex flex-col items-center justify-center gap-0.5",
                        isHanbokAllowed && "hover:border-zinc-900 hover:bg-zinc-50",
                        "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                        "active:scale-[0.95]",
                        !isHanbokAllowed && "opacity-30 cursor-not-allowed",
                        selectedDay === day
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900"
                      )}
                    >
                      <p className="text-sm font-medium">
                        {day}
                      </p>
                      <p className={cn(
                        "text-xs font-bold",
                        selectedDay === day 
                          ? weekend ? "text-red-200" : "text-zinc-300"
                          : weekend ? "text-red-600" : "text-zinc-500"
                      )}>
                        {dayOfWeek}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
            
            <button
              onClick={() => handleUndecided('day')}
              className={cn(
                "w-full p-4 text-center border-2 transition-all duration-300",
                "border-zinc-300 bg-zinc-50 hover:border-zinc-600 hover:bg-zinc-100",
                "focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2",
                "active:scale-[0.99]"
              )}
            >
              <p className="text-sm font-normal text-zinc-600">
                일 미정
              </p>
            </button>
          </div>
        )}

        {/* Time Selection */}
        {currentStep === 'time' && !customTimeMode && (
          <div 
            className={cn(
              "space-y-4 transition-all duration-300",
              stepTransition ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
            )}
          >
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {timeSlots.map((timeSlot) => (
                <button
                  key={timeSlot.value}
                  onClick={() => handleTimeSelect(timeSlot.value)}
                  className={cn(
                    "w-full p-4 text-center border-2 transition-all duration-300",
                    "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                    "active:scale-[0.99]",
                    selectedTime === timeSlot.value
                      ? "border-zinc-900 bg-zinc-50 shadow-sm"
                      : "border-zinc-200 bg-white"
                  )}
                >
                  <p className="text-base font-light text-zinc-900">
                    {timeSlot.label}
                  </p>
                </button>
              ))}
            </div>
            
            {/* Custom Time Button - Only for wedding (not hanbok) */}
            {productType === 'wedding' && (
              <button
                onClick={handleCustomTimeToggle}
                className={cn(
                  "w-full p-4 text-center border-2 transition-all duration-300",
                  "border-blue-300 bg-blue-50 hover:border-blue-600 hover:bg-blue-100",
                  "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                  "active:scale-[0.99]"
                )}
              >
                <p className="text-sm font-semibold text-blue-700">
                  ⏰ 시간 직접 입력 (10분 단위)
                </p>
              </button>
            )}
            
            <button
              onClick={() => handleUndecided('time')}
              className={cn(
                "w-full p-4 text-center border-2 transition-all duration-300",
                "border-zinc-300 bg-zinc-50 hover:border-zinc-600 hover:bg-zinc-100",
                "focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2",
                "active:scale-[0.99]"
              )}
            >
              <p className="text-sm font-normal text-zinc-600">
                시간 미정
              </p>
            </button>
          </div>
        )}

        {/* Custom Time Selection */}
        {currentStep === 'time' && customTimeMode && (
          <div 
            className={cn(
              "space-y-6 transition-all duration-300",
              "opacity-100 translate-x-0"
            )}
          >
            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-zinc-900">
                시간을 직접 입력해 주세요
              </p>
              <p className="text-xs text-zinc-500">
                10분 단위로 입력 가능합니다
              </p>
            </div>

            {/* Hour Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                시간
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {Array.from({ length: 8 }, (_, i) => i + 11).map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleCustomHourSelect(hour)}
                    className={cn(
                      "p-3 text-center border-2 transition-all duration-300",
                      "hover:border-zinc-900 hover:bg-zinc-50",
                      "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                      "active:scale-[0.95]",
                      customHour === hour
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900"
                    )}
                  >
                    <p className="text-sm font-medium">
                      {hour < 12 ? `오전 ${hour}시` : hour === 12 ? '낮 12시' : `오후 ${hour - 12}시`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Minute Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">
                분
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[0, 10, 20, 30, 40, 50].map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleCustomMinuteSelect(minute)}
                    className={cn(
                      "p-3 text-center border-2 transition-all duration-300",
                      "hover:border-zinc-900 hover:bg-zinc-50",
                      "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                      "active:scale-[0.95]",
                      customMinute === minute
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900"
                    )}
                  >
                    <p className="text-sm font-medium">
                      {String(minute).padStart(2, '0')}분
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Custom Time Display */}
            {customHour !== null && customMinute !== null && (
              <div className="p-4 bg-zinc-900 text-white text-center rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium">
                  선택된 시간
                </p>
                <p className="text-lg font-semibold mt-1">
                  {formatCustomTime(`${String(customHour).padStart(2, '0')}:${String(customMinute).padStart(2, '0')}`)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Info */}
        <div className="text-center space-y-4">
          {currentStep === 'time' ? (
            <p className="text-xs text-zinc-400 leading-relaxed">
              {productType === 'hanbok' ? '촬영 시간대를 선택해 주세요' : '예식 시간을 선택해 주세요'}
            </p>
          ) : (
            <p className="text-xs text-zinc-400 leading-relaxed">
              {productType === 'hanbok' 
                ? '정확한 날짜가 정해지지 않으셨다면<br />예상되는 날짜를 선택해 주세요'
                : '정확한 날짜가 정해지지 않으셨다면<br />예상되는 날짜를 선택해 주세요'
              }
            </p>
          )}
          
          <div className="pt-2 px-5 py-4 border-2 border-zinc-900 bg-zinc-50">
            <p className="text-xs text-zinc-900 leading-relaxed font-bold">
              ⚡ 긴급 촬영이 필요하신가요?
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed mt-2">
              빠른 일정 확인을 위해 하단의<br />
              전화 또는 카카오톡으로 문의해 주세요
            </p>
          </div>
          
          <div className="pt-2 px-5 py-4 border border-zinc-300 bg-white">
            <p className="text-xs text-zinc-700 leading-relaxed font-semibold">
              📅 일정 안내
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed mt-2">
              선택하신 일정을 확인 후<br />
              담당자가 빠르게 연락드리겠습니다
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            disabled={!selectedYear || !selectedMonth || !selectedDay || !selectedTime}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            )}
          >
            다음
          </Button>

          <button
            onClick={handleBack}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-200",
              "text-zinc-600 hover:text-zinc-900",
              "active:scale-[0.98]"
            )}
          >
            {currentStep === 'year' ? '이전' : customTimeMode ? '목록으로' : '뒤로'}
          </button>
          
          {currentStep === 'time' && (
            <p className="text-xs text-center text-zinc-400 leading-relaxed pt-2">
              {productType === 'hanbok' ? '촬영 시간대는 나중에 변경하실 수 있습니다' : '예식 시간은 나중에 변경하실 수 있습니다'}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

      </div>
    </div>
  )
}


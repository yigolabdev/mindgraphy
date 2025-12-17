'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Camera, Package, Users } from 'lucide-react'

// 월별 매출 데이터 (최근 6개월)
const revenueData = [
  { month: '6월', revenue: 4200 },
  { month: '7월', revenue: 4800 },
  { month: '8월', revenue: 5200 },
  { month: '9월', revenue: 4900 },
  { month: '10월', revenue: 5600 },
  { month: '11월', revenue: 6200 }
]

// 작가별 촬영 건수
const photographerData = [
  { name: '김작가', shoots: 28 },
  { name: '이작가', shoots: 25 },
  { name: '박작가', shoots: 32 },
  { name: '최작가', shoots: 22 },
  { name: '정작가', shoots: 19 }
]

// 패키지 선택 비율
const packageData = [
  { name: '프리미엄', value: 45, color: '#8b5cf6' },
  { name: '스탠다드', value: 35, color: '#3b82f6' },
  { name: '베이직', value: 20, color: '#10b981' }
]

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export function RevenueChart() {
  return (
    <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-green-600" />
          월별 매출 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}만`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}만원`, '매출']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">6개월 평균</span>
          <span className="font-semibold text-green-600">
            +18% 증가
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function PhotographerChart() {
  return (
    <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="h-5 w-5 text-blue-600" />
          작가별 촬영 건수
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={photographerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}건`, '촬영']}
            />
            <Bar
              dataKey="shoots"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            >
              {photographerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">이번 달 총 촬영</span>
          <span className="font-semibold">
            {photographerData.reduce((sum, p) => sum + p.shoots, 0)}건
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function PackageChart() {
  return (
    <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-5 w-5 text-purple-600" />
          패키지 선택 비율
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={packageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {packageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}%`, '비율']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {packageData.map((pkg) => (
            <div key={pkg.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: pkg.color }}
                />
                <span className="text-muted-foreground">{pkg.name}</span>
              </div>
              <span className="font-medium">{pkg.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 고객 유입경로 차트
interface SourceChannelChartProps {
  data: Array<{ name: string; value: number; color: string }>
}

export function SourceChannelChart({ data }: SourceChannelChartProps) {
  const totalCustomers = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5 text-emerald-600" />
          고객 유입경로
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${value}명`, '고객 수']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((channel) => (
            <div key={channel.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: channel.color }}
                />
                <span className="text-muted-foreground">{channel.name}</span>
              </div>
              <span className="font-medium">{channel.value}명</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">전체 고객</span>
          <span className="font-semibold text-emerald-600">
            {totalCustomers}명
          </span>
        </div>
      </CardContent>
    </Card>
  )
}


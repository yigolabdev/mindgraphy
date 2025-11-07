'use client'

import { use } from 'react'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/common/empty-state'
import { CreditCard } from 'lucide-react'

interface PaymentPageProps {
  params: Promise<{ token: string }>
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { token } = use(params)

  return (
    <ClientPortalLayout token={token}>
      <Card>
        <CardHeader>
          <CardTitle>결제 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CreditCard}
            title="결제 내역 및 영수증"
            description="결제 내역, 잔액, 영수증 발급 기능이 여기에 표시됩니다."
          />
        </CardContent>
      </Card>
    </ClientPortalLayout>
  )
}


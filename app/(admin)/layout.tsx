export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // PageAccessGuard에서 모든 인증 및 권한 체크를 처리하므로
  // 이 레이아웃에서는 단순히 자식을 렌더링만 함
  return <>{children}</>
}


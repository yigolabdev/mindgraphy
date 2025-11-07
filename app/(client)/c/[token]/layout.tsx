import { STATIC_TOKENS } from '@/lib/constants'

// Generate static params for all tokens at layout level
export async function generateStaticParams() {
  return STATIC_TOKENS.map((token) => ({
    token,
  }))
}

export default function TokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


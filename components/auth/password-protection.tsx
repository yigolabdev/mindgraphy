'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const PASSWORD_STORAGE_KEY = 'site_access_granted';
const PASSWORD_TIMESTAMP_KEY = 'site_access_timestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 프로덕션 환경 체크
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  const requiredPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

  useEffect(() => {
    // 로컬 환경이거나 비밀번호가 설정되지 않은 경우 바로 인증 통과
    if (!isProduction || !requiredPassword) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // 기존 세션 체크
    const checkExistingSession = () => {
      try {
        const isGranted = localStorage.getItem(PASSWORD_STORAGE_KEY);
        const timestamp = localStorage.getItem(PASSWORD_TIMESTAMP_KEY);

        if (isGranted === 'true' && timestamp) {
          const sessionAge = Date.now() - parseInt(timestamp, 10);
          
          // 세션이 유효한 경우
          if (sessionAge < SESSION_DURATION) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } else {
            // 세션 만료
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
            localStorage.removeItem(PASSWORD_TIMESTAMP_KEY);
          }
        }

        setIsAuthenticated(false);
        setIsLoading(false);
      } catch (err) {
        console.error('Session check error:', err);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, [isProduction, requiredPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === requiredPassword) {
      try {
        localStorage.setItem(PASSWORD_STORAGE_KEY, 'true');
        localStorage.setItem(PASSWORD_TIMESTAMP_KEY, Date.now().toString());
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Storage error:', err);
        setError('세션 저장에 실패했습니다.');
      }
    } else {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 인증 완료 또는 비밀번호 불필요
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 비밀번호 입력 화면
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">보호된 페이지</CardTitle>
          <CardDescription className="text-center">
            비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="숫자 4자리"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-destructive text-center text-2xl tracking-widest' : 'text-center text-2xl tracking-widest'}
                autoFocus
                maxLength={4}
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg">
              확인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

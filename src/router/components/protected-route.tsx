import { useCallback, useEffect } from 'react';
import { useUserToken } from '@/store/userStore';
import { ErrorBoundary } from 'react-error-boundary';
import PageError from '@/pages/error/PageError';
import { useRouter } from '../hooks';
import { useLocation } from 'react-router-dom';
interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const accessToken = useUserToken();
  const location = useLocation();
  const check = useCallback(async () => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }
  }, [router, accessToken, location.pathname]);

  useEffect(() => {
    check();
  }, [check]);

  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
};

export default ProtectedRoute;

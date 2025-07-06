// src/components/auth/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Make sure this path is correct
export const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    // Try-catch to prevent the error when context isn't available
    try {
        const { isAuthenticated, isLoading } = useAuth();
        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, isLoading, router]);
        if (isLoading) {
            return <div>Loading...</div>;
        }
        return isAuthenticated ? <>{children}</> : null;
    }
    catch (error) {
        // If useAuth fails, redirect to login
        useEffect(() => {
            router.push('/login');
        }, [router]);
        return null;
    }
};
export default ProtectedRoute;

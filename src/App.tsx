import React, { useEffect } from 'react';
import { useApp, AppProvider, normalizePath } from './context/AppContext';
import { CommercialLandingPage } from './components/landing/CommercialLandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { UserDashboardLayout } from './components/dashboard/UserDashboardLayout';
import { InfluencerDashboardLayout } from './components/dashboard/InfluencerDashboardLayout';
import { AdminDashboardLayout } from './components/dashboard/AdminDashboardLayout';
import { NotFoundPage } from './components/common/NotFoundPage';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { LiveCallRoom } from './components/call/LiveCallRoom';
import { Sparkles } from 'lucide-react';

const VALID_FAN_ROUTES = [
  '/fan/dashboard',
  '/fan/bookings',
  '/fan/grievances',
  '/fan/profile',
];

const VALID_INFLUENCER_ROUTES = [
  '/influencer/dashboard',
  '/influencer/profile',
  '/influencer/rates',
  '/influencer/availability',
  '/influencer/bookings',
  '/influencer/earnings',
  '/influencer/reviews',
];

const VALID_ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/creators',
  '/admin/bookings',
  '/admin/payments',
  '/admin/commission',
  '/admin/grievances',
  '/admin/moderation',
  '/admin/announcements',
  '/admin/reports',
  '/admin/audit',
];

const MainRouter: React.FC = () => {
  const { 
    isAuthenticated, 
    currentRole, 
    currentPath, 
    navigate, 
    activeCall, 
    checkoutFlow, 
    toastMessage,
    showToast 
  } = useApp();

  // Enforce RBAC route protection and redirects
  useEffect(() => {
    const path = normalizePath(currentPath);

    // 1. Unauthenticated users trying to access protected dashboards
    if (!isAuthenticated) {
      if (path.startsWith('/admin') && path !== '/admin/login') {
        showToast('Restricted: Please sign in to access the Admin Console.');
        navigate('/admin/login');
      } else if (path.startsWith('/fan') || path.startsWith('/user') || path.startsWith('/influencer')) {
        showToast('Please sign in to access this portal.');
        navigate('/auth');
      }
      return;
    }

    // 2. Authenticated users visiting auth routes (/auth, /login)
    if (path === '/auth' || path === '/login') {
      if (currentRole === 'user') navigate('/fan/dashboard');
      else if (currentRole === 'influencer') navigate('/influencer/dashboard');
      else if (currentRole === 'admin') navigate('/admin/dashboard');
      return;
    }

    // 3. Authenticated Admin visiting /admin/login
    if (path === '/admin/login' && currentRole === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    // 4. Role-based Access Control (Strict Portal Isolation)
    if (currentRole === 'user') {
      if (path.startsWith('/admin') || path.startsWith('/influencer')) {
        showToast('Access Denied: You do not have permissions for that portal.');
        navigate('/fan/dashboard');
      }
    } else if (currentRole === 'influencer') {
      if (path.startsWith('/admin') || path.startsWith('/fan') || path.startsWith('/user')) {
        showToast('Access Denied: You do not have permissions for that portal.');
        navigate('/influencer/dashboard');
      }
    } else if (currentRole === 'admin') {
      if (path.startsWith('/fan') || path.startsWith('/user') || path.startsWith('/influencer')) {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, currentRole, currentPath]);

  // Determine what component to render based on path and role
  const renderCurrentView = () => {
    const path = normalizePath(currentPath);

    // 1. Public Landing Page
    if (path === '/') {
      return <CommercialLandingPage />;
    }

    // 2. Public / Dedicated Authentication Page
    if (path === '/auth' || path === '/login' || path === '/register') {
      return <AuthPage />;
    }

    // 3. Separate Admin Login Gateway
    if (path === '/admin/login') {
      if (isAuthenticated && currentRole === 'admin') {
        return <AdminDashboardLayout />;
      }
      return <AdminLoginPage />;
    }

    // 4. Fan Portal Routes
    if (path.startsWith('/fan') || path.startsWith('/user')) {
      if (isAuthenticated && currentRole === 'user') {
        const isValid = VALID_FAN_ROUTES.includes(path) || path.startsWith('/fan/creators/');
        if (isValid) return <UserDashboardLayout />;
        return <NotFoundPage />;
      }
      return <AuthPage />;
    }

    // 5. Influencer Portal Routes
    if (path.startsWith('/influencer')) {
      if (isAuthenticated && currentRole === 'influencer') {
        const isValid = VALID_INFLUENCER_ROUTES.includes(path);
        if (isValid) return <InfluencerDashboardLayout />;
        return <NotFoundPage />;
      }
      return <AuthPage />;
    }

    // 6. Admin Portal Routes
    if (path.startsWith('/admin')) {
      if (isAuthenticated && currentRole === 'admin') {
        const isValid = VALID_ADMIN_ROUTES.includes(path);
        if (isValid) return <AdminDashboardLayout />;
        return <NotFoundPage />;
      }
      return <AdminLoginPage />;
    }

    // 7. Fallback: 404 Not Found Page for invalid URLs
    return <NotFoundPage />;
  };

  return (
    <>
      {renderCurrentView()}

      {/* Global Checkout Modal */}
      {checkoutFlow && <CheckoutModal />}

      {/* Global Live Call Session (E2E encrypted room) */}
      {activeCall && <LiveCallRoom />}

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-soft-lg animate-slideDown border border-slate-800">
          <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

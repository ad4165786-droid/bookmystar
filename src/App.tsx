import React, { useEffect } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { CommercialLandingPage } from './components/landing/CommercialLandingPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { UserDashboardLayout } from './components/dashboard/UserDashboardLayout';
import { InfluencerDashboardLayout } from './components/dashboard/InfluencerDashboardLayout';
import { AdminDashboardLayout } from './components/dashboard/AdminDashboardLayout';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { LiveCallRoom } from './components/call/LiveCallRoom';
import { Sparkles } from 'lucide-react';

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

  // Enforce RBAC route protection
  useEffect(() => {
    // 1. If unauthenticated and trying to visit a protected dashboard
    if (!isAuthenticated) {
      if (currentPath === '/admin/dashboard' || currentPath.startsWith('/admin/dashboard')) {
        navigate('/admin/login');
      } else if (currentPath.includes('/dashboard')) {
        navigate('/');
      }
      return;
    }

    // 2. If authenticated as USER
    if (currentRole === 'user') {
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/influencer')) {
        showToast('Access Denied: You do not have permissions for that portal.');
        navigate('/user/dashboard');
      }
    }

    // 3. If authenticated as INFLUENCER
    if (currentRole === 'influencer') {
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/user')) {
        showToast('Access Denied: You do not have permissions for that portal.');
        navigate('/influencer/dashboard');
      }
    }

    // 4. If authenticated as ADMIN
    if (currentRole === 'admin') {
      if (currentPath.startsWith('/user') || currentPath.startsWith('/influencer')) {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, currentRole, currentPath]);

  // Determine what component to render based on path and authentication
  const renderCurrentView = () => {
    // Special Hidden Route: /admin/login
    if (currentPath === '/admin/login') {
      if (isAuthenticated && currentRole === 'admin') {
        return <AdminDashboardLayout />;
      }
      return <AdminLoginPage />;
    }

    // Role-based Dashboard Separation (Strictly separated layouts)
    if (isAuthenticated) {
      if ((currentPath.startsWith('/user') || currentPath === '/user/dashboard') && currentRole === 'user') {
        return <UserDashboardLayout />;
      }
      if ((currentPath.startsWith('/influencer') || currentPath === '/influencer/dashboard') && currentRole === 'influencer') {
        return <InfluencerDashboardLayout />;
      }
      if ((currentPath.startsWith('/admin') || currentPath === '/admin/dashboard') && currentRole === 'admin') {
        return <AdminDashboardLayout />;
      }
    }

    // Public Commercial Landing Page (like petcarecomodizo.vercel.app)
    return <CommercialLandingPage />;
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

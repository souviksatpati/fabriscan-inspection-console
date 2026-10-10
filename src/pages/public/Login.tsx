import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { MOCK_USERS } from '../../data/mock/mockUsers';
import { Logo } from '../../components/common/Logo';
import { ArrowLeft, Eye, EyeOff, Loader2, AlertCircle, ChevronDown, UserCheck, X } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export const Login: React.FC = () => {
  useDocumentTitle('Sign in | Maruti FabriScan');

  const { user, loginWithCredentials } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const [id, setId] = useState('usr-001');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDemoPopover, setShowDemoPopover] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const demoButtonRef = useRef<HTMLButtonElement>(null);

  // Lock html and body scrolling while Login page is mounted, restore on unmount
  useEffect(() => {
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, []);

  // Close demo popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        demoButtonRef.current &&
        !demoButtonRef.current.contains(e.target as Node)
      ) {
        setShowDemoPopover(false);
      }
    };

    if (showDemoPopover) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showDemoPopover]);

  // If already signed in, redirect to destination
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'SUPPLIER_QA' ? '/app/reports' : '/app/live-inspection';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);

    const trimmedId = id.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setError('Please enter both User ID and password.');
      return;
    }

    setIsLoading(true);

    try {
      const loggedUser = await loginWithCredentials(trimmedId, trimmedPassword);
      const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      const defaultPath =
        loggedUser.role === 'SUPPLIER_QA' ? '/app/reports' : '/app/live-inspection';
      const destination = fromPath || defaultPath;

      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid User ID or password.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = (demoKey: keyof typeof MOCK_USERS) => {
    const demo = MOCK_USERS[demoKey];
    if (demo) {
      setId(demo.userId);
      setPassword('password');
      setError(null);
      setShowDemoPopover(false);
    }
  };

  return (
    <div className="h-dvh w-full flex bg-[#FFFFFF] text-[#0F172A] font-sans relative selection:bg-[#DBEAFE] overflow-hidden">
      {/* Left Panel: Edge-to-edge illustration (~62% on desktop, hidden on tablet/mobile) */}
      <section
        aria-label="Inspection System Visual"
        className="hidden lg:flex lg:w-[62%] h-full relative bg-[#F4F6FA] overflow-hidden items-center justify-center p-0 select-none"
      >
        {!imageError ? (
          <img
            src="/images/login-illustration.png"
            alt=""
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F7FA] flex flex-col items-center justify-center p-8 text-center text-[#64748B]">
            <svg
              className="w-24 h-24 text-[#CBD5E1] mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <path d="M7 10l3 3 7-7" />
            </svg>
            <h2 className="text-base font-bold text-[#0F172A] mb-1 font-sans">
              Maruti FabriScan AOI
            </h2>
            <p className="text-xs text-[#64748B] max-w-xs">
              Automated optical inspection and defect classification.
            </p>
          </div>
        )}
      </section>

      {/* Right Panel: Form Panel (~38% on desktop, 100% on tablet/mobile) */}
      <section
        aria-label="Operator Authentication Form"
        className="w-full lg:w-[38%] h-full flex flex-col justify-between items-center px-6 sm:px-10 py-3 sm:py-5 bg-white relative z-10 overflow-hidden"
      >
        {/* Top bar: Back to Home link */}
        <div className="w-full flex items-center justify-between shrink-0 mb-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] bg-white px-2.5 py-1 rounded-full border border-[#D9DEE5] shadow-xs transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Vertically centered form container using clamp/vh spacing */}
        <div className="w-full max-w-[24rem] my-auto flex flex-col items-start text-left py-1 sm:py-2">
          {/* Logo above title */}
          <div className="mb-2 sm:mb-3">
            <Logo linkTo="/" showSubtitle={false} />
          </div>

          {/* Heading and Subtitle */}
          <h1 className="text-[clamp(1.5rem,3.2vh,2rem)] font-semibold text-[#0F172A] tracking-tight leading-tight mb-1 font-sans">
            Sign in
          </h1>
          <p className="text-[clamp(0.75rem,1.6vh,0.875rem)] text-[#64748B] leading-snug mb-3 sm:mb-4 font-sans">
            Welcome to Maruti FabriScan.<br />
            Sign in with your station account.
          </p>

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-2.5 sm:space-y-3">
            {/* User ID Field */}
            <div>
              <label
                htmlFor="user-id"
                className="block text-[0.6875rem] font-sans font-semibold text-[#0F172A] mb-1"
              >
                User ID
              </label>
              <input
                id="user-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                placeholder="e.g. usr-001"
                className="w-full h-[clamp(2.25rem,4.5vh,2.75rem)] px-3 rounded-[0.375rem] bg-[#F1F3F8] border border-transparent text-[#0F172A] text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field with Show/Hide Eye Button */}
            <div>
              <label
                htmlFor="user-password"
                className="block text-[0.6875rem] font-sans font-semibold text-[#0F172A] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-[clamp(2.25rem,4.5vh,2.75rem)] pl-3 pr-10 rounded-[0.375rem] bg-[#F1F3F8] border border-transparent text-[#0F172A] text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] transition-colors focus:outline-none focus:ring-1 focus:ring-[#1D4ED8] rounded-[0.25rem]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Reserved Height Error Message Area to Prevent Layout Shift */}
            <div className="h-7 w-full flex items-center">
              {error ? (
                <div
                  role="alert"
                  className="w-full p-1.5 rounded-[0.25rem] bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-[0.6875rem] font-sans flex items-center gap-1.5 animate-fadeIn"
                >
                  <AlertCircle size={13} className="text-[#B91C1C] shrink-0" />
                  <span className="truncate">{error}</span>
                </div>
              ) : null}
            </div>

            {/* Primary Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[clamp(2.25rem,4.5vh,2.75rem)] rounded-[0.375rem] bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] text-white font-sans text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin text-white" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Demo Accounts Popover / Floating Overlay (anchored to button, does not push layout) */}
          <div className="relative w-full mt-3 pt-2 border-t border-[#E2E8F0]">
            <button
              ref={demoButtonRef}
              type="button"
              onClick={() => setShowDemoPopover(!showDemoPopover)}
              className="flex items-center justify-between text-xs font-semibold text-[#475569] hover:text-[#0F172A] cursor-pointer py-0.5 select-none w-full"
            >
              <span className="flex items-center gap-1.5">
                <UserCheck size={14} className="text-[#1D4ED8]" />
                <span>Demo accounts</span>
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-[#64748B] ${
                  showDemoPopover ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Anchored Popover Overlay */}
            {showDemoPopover && (
              <div
                ref={popoverRef}
                className="absolute bottom-full mb-2 inset-x-0 bg-white border border-[#D9DEE5] rounded-[0.375rem] shadow-[0_8px_24px_rgba(15,23,42,0.12)] p-2.5 z-50 animate-fadeIn"
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E2E8F0]">
                  <span className="text-[0.625rem] font-bold text-[#64748B] uppercase tracking-wider font-mono">
                    Select Demo Role
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDemoPopover(false)}
                    className="text-[#64748B] hover:text-[#0F172A] p-0.5"
                    aria-label="Close"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {Object.entries(MOCK_USERS).map(([key, u]) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] p-1.5 sm:p-2 rounded-[0.25rem] text-xs transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-[#0F172A] block text-xs truncate">
                          {u.roleTitle}
                        </span>
                        <span className="text-[0.625rem] font-mono text-[#64748B] block">
                          {u.userId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseDemo(key as keyof typeof MOCK_USERS)}
                        className="px-2 py-0.5 text-[0.6875rem] font-semibold text-[#1D4ED8] bg-white border border-[#D9DEE5] hover:border-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[0.25rem] transition-colors cursor-pointer shrink-0"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer line at bottom of form panel */}
        <div className="w-full text-center py-2 shrink-0 border-t border-[#E2E8F0] text-[0.6875rem] text-[#94A3B8] font-sans">
          Authorized personnel only.
        </div>
      </section>
    </div>
  );
};

export default Login;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { CornerBrackets } from '../../components/common/CornerBrackets';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Maruti FabriScan';
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans text-center bg-white text-[#0F172A]">
      <div className="relative bg-white border border-[#D9DEE5] p-8 sm:p-12 rounded-[4px] max-w-md w-full shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
        <CornerBrackets size={8} color="border-[#B91C1C]" />
        <div className="w-12 h-12 rounded-[4px] bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#B91C1C] mx-auto mb-4">
          <ShieldAlert size={24} />
        </div>
        <div className="text-[#B91C1C] text-xs font-bold uppercase tracking-widest mb-1 font-mono">
          ERROR 404
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2 font-sans">Station Route Not Found</h1>
        <p className="text-xs text-[#475569] font-sans leading-relaxed mb-6 font-normal">
          The requested industrial inspection path does not exist or has been decommissioned by the
          line supervisor.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline" size="sm" className="font-sans text-xs gap-1.5">
            <Link to="/">
              <ArrowLeft size={13} /> Return to Portal
            </Link>
          </Button>
          <Button asChild variant="default" size="sm" className="font-sans text-xs">
            <Link to="/app/live-inspection">Live Console</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

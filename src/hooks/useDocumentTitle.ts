import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Maruti FabriScan: Edge Automated Optical Inspection',
  '/about': 'About Project | Maruti FabriScan',
  '/login': 'Sign In | Maruti FabriScan',
  '/app/live-inspection': 'Live Inspection | Maruti FabriScan',
  '/app/production': 'Production Telemetry | Maruti FabriScan',
  '/app/defects': 'Defect History | Maruti FabriScan',
  '/app/reports': 'Quality Reports | Maruti FabriScan',
  '/app/cameras': 'Camera Array | Maruti FabriScan',
  '/app/system-health': 'System Health | Maruti FabriScan',
  '/app/settings': 'Line Settings | Maruti FabriScan',
  '/app/operators': 'Operators | Maruti FabriScan',
  '/app/profile': 'Operator Profile | Maruti FabriScan',
};

export function useDocumentTitle(titleOverride?: string) {
  const location = useLocation();

  useEffect(() => {
    if (titleOverride) {
      document.title = titleOverride;
      return;
    }

    const pathname = location.pathname;
    const title = ROUTE_TITLES[pathname] || (pathname.startsWith('/app') ? 'Control Room | Maruti FabriScan' : 'Maruti FabriScan');
    document.title = title;
  }, [location.pathname, titleOverride]);
}

'use client';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/stores/useAppStore';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import OverviewDashboard from '@/components/dashboards/OverviewDashboard';
import ComingSoonModule from '@/components/ComingSoonModule';
import { MODULES } from '@/components/Sidebar';

const HSSEDashboard = dynamic(() => import('@/components/dashboards/HSSEDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const PlanningDashboard = dynamic(() => import('@/components/dashboards/PlanningDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const DailyReportsDashboard = dynamic(() => import('@/components/dashboards/DailyReportsDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const CostControlDashboard = dynamic(() => import('@/components/dashboards/CostControlDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const ProcurementDashboard = dynamic(() => import('@/components/dashboards/ProcurementDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const QCDashboard = dynamic(() => import('@/components/dashboards/QCDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const DocumentControlDashboard = dynamic(() => import('@/components/dashboards/DocumentControlDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const EngineeringDashboard = dynamic(() => import('@/components/dashboards/EngineeringDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const CommissioningDashboard = dynamic(() => import('@/components/dashboards/CommissioningDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const HRDashboard = dynamic(() => import('@/components/dashboards/HRDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const FinanceDashboard = dynamic(() => import('@/components/dashboards/FinanceDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const SecurityDashboard = dynamic(() => import('@/components/dashboards/SecurityDashboard'), {
  loading: () => <LoadingSkeleton />,
});
const AdminDashboard = dynamic(() => import('@/components/dashboards/AdminDashboard'), {
  loading: () => <LoadingSkeleton />,
});

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading module...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { activeModule } = useAppStore();

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewDashboard />;
      case 'hsse': return <HSSEDashboard />;
      case 'planning': return <PlanningDashboard />;
      case 'daily-reports': return <DailyReportsDashboard />;
      case 'cost-control': return <CostControlDashboard />;
      case 'procurement': return <ProcurementDashboard />;
      case 'qc': return <QCDashboard />;
      case 'document-control': return <DocumentControlDashboard />;
      case 'engineering': return <EngineeringDashboard />;
      case 'commissioning': return <CommissioningDashboard />;
      case 'hr': return <HRDashboard />;
      case 'finance': return <FinanceDashboard />;
      case 'security': return <SecurityDashboard />;
      case 'admin': return <AdminDashboard />;
      default: {
        const mod = MODULES.find(m => m.id === activeModule);
        return <ComingSoonModule name={mod?.label || activeModule} />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

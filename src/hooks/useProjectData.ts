'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types';

// Demo fallback data
const DEMO_PROJECT: Project = {
    id: 'demo',
    name: 'Karimun LNG Terminal - Phase 2',
    code: 'KLT-P2',
    client: 'PT Karimun Gas Energy',
    contract_value: 2400000000,
    currency: 'USD',
    start_date: '2025-01-15',
    end_date: '2027-12-31',
    forecast_end: '2028-02-14',
    status: 'active',
    overall_progress: 38.2,
    spi: 0.94,
    cpi: 1.02,
};

interface DashboardStats {
    safeManHours: number;
    activeWorkers: number;
    openPermits: number;
    ltiFreeDays: number;
}

const DEMO_STATS: DashboardStats = {
    safeManHours: 4780000,
    activeWorkers: 2847,
    openPermits: 34,
    ltiFreeDays: 847,
};

interface ActivityItem {
    time: string;
    text: string;
    color: string;
    created_at?: string;
}

const DEMO_ACTIVITIES: ActivityItem[] = [
  { time: '2m ago', text: 'Daily Report submitted by Site Manager', color: 'bg-blue-400' },
  { time: '15m ago', text: 'PTW-487 issued for Hot Work at Tank Farm', color: 'bg-red-400' },
  { time: '30m ago', text: 'QC Inspection completed - Pipe Rack B', color: 'bg-green-400' },
  { time: '1h ago', text: 'Safety Observation #1245 recorded', color: 'bg-yellow-400' },
  { time: '2h ago', text: 'Procurement PO-2847 approved', color: 'bg-purple-400' },
  { time: '3h ago', text: 'Milestone M-12 achieved ahead of schedule', color: 'bg-cyan-400' },
  ];

function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !!url && url !== 'https://placeholder.supabase.co' && url !== 'https://demo.supabase.co';
}

export function useProjectData() {
    const [project, setProject] = useState<Project>(DEMO_PROJECT);
    const [stats, setStats] = useState<DashboardStats>(DEMO_STATS);
    const [activities, setActivities] = useState<ActivityItem[]>(DEMO_ACTIVITIES);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
        async function fetchData() {
                if (!isSupabaseConfigured()) {
                          setLoading(false);
                          return;
                }

          try {
                    const supabase = createClient();

                  // Fetch project
                  const { data: projectData, error: projError } = await supabase
                      .from('projects')
                      .select('*')
                      .eq('status', 'active')
                      .limit(1)
                      .single();

                  if (projError || !projectData) {
                              setLoading(false);
                              return;
                  }

                  setProject({
                              id: projectData.id,
                              name: projectData.name,
                              code: projectData.code,
                              client: projectData.client,
                              contract_value: parseFloat(projectData.contract_value),
                              currency: projectData.currency,
                              start_date: projectData.start_date,
                              end_date: projectData.end_date,
                              forecast_end: projectData.forecast_end,
                              status: projectData.status,
                              overall_progress: parseFloat(projectData.overall_progress),
                              spi: parseFloat(projectData.spi),
                              cpi: parseFloat(projectData.cpi),
                  });
                    setIsDemo(false);

                  // Fetch aggregated stats
                  const [permitsRes, manpowerRes] = await Promise.all([
                              supabase.from('permits').select('id', { count: 'exact', head: true }).eq('status', 'active'),
                              supabase.from('manpower_log').select('total_workers').order('log_date', { ascending: false }).limit(1).single(),
                            ]);

                  setStats({
                              safeManHours: DEMO_STATS.safeManHours,
                              activeWorkers: manpowerRes.data?.total_workers ?? DEMO_STATS.activeWorkers,
                              openPermits: permitsRes.count ?? DEMO_STATS.openPermits,
                              ltiFreeDays: DEMO_STATS.ltiFreeDays,
                  });

                  // Fetch recent activity from daily_reports
                  const { data: reportsData } = await supabase
                      .from('daily_reports')
                      .select('id, date, submitted_by, status, created_at')
                      .order('created_at', { ascending: false })
                      .limit(6);

                  if (reportsData && reportsData.length > 0) {
                              setActivities(reportsData.map((r) => ({
                                            time: getRelativeTime(r.created_at),
                                            text: `Daily Report ${r.status} by ${r.submitted_by}`,
                                            color: r.status === 'approved' ? 'bg-green-400' : r.status === 'submitted' ? 'bg-blue-400' : 'bg-yellow-400',
                                            created_at: r.created_at,
                              })));
                  }
          } catch (err) {
                    console.error('Failed to fetch project data:', err);
          } finally {
                    setLoading(false);
          }
        }

                fetchData();
  }, []);

  return { project, stats, activities, loading, isDemo };
}

function getRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

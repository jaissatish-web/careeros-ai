'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Mail,
  CalendarCheck,
  Award,
  Flame,
  FileText,
  Share2,
  PenTool,
  Mic,
  ChevronRight,
  Sparkles,
  Target,
  Brain,
  Clock,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

/* ─── helpers ─── */
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const getTodayLabel = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── small SVG components ─── */
function MiniSparkline({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  const path = `M${pts.join(' L')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className='opacity-80'>
      <defs>
        <linearGradient id={`spg-${color.replace('#','')}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={color} stopOpacity={0.3} />
          <stop offset='100%' stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L${w},${h} L0,${h} Z`}
        fill={`url(#spg-${color.replace('#','')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={path}
        fill='none'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

function CircularGauge({ score = 87, size = 180 }: { score?: number; size?: number }) {
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);
  const offset = circ - (animated / 100) * circ;
  return (
    <div className='relative' style={{ width: size, height: size }}>
      <svg width={size} height={size} className='-rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          stroke='rgba(255,255,255,0.07)'
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          stroke='url(#gaugeGrad)'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />
        <defs>
          <linearGradient id='gaugeGrad' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#6366f1' />
            <stop offset='100%' stopColor='#a855f7' />
          </linearGradient>
        </defs>
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <motion.span
          className='text-4xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {score}
        </motion.span>
        <span className='text-xs text-gray-400 tracking-wider uppercase'>/ 100</span>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: number[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const max = Math.max(...data);
  const barWidth = 40;
  const gap = 32;
  const h = 140;
  const w = data.length * (barWidth + gap) + gap;

  return (
    <svg width='100%' viewBox={`0 0 ${w} ${h + 40}`} className='overflow-visible'>
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1={gap}
          x2={w - gap}
          y1={h - p * h}
          y2={h - p * h}
          stroke='rgba(255,255,255,0.05)'
          strokeDasharray='4 4'
        />
      ))}
      {data.map((v, i) => {
        const barH = (v / max) * h;
        const x = gap + i * (barWidth + gap);
        const y = h - barH;
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bar-${i}`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#6366f1' />
                <stop offset='100%' stopColor='#8b5cf6' />
              </linearGradient>
            </defs>
            <motion.rect
              x={x}
              width={barWidth}
              rx={6}
              fill={`url(#bar-${i})`}
              initial={{ y: h, height: 0 }}
              animate={{ y, height: barH }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
            <motion.text
              x={x + barWidth / 2}
              y={h + 20}
              textAnchor='middle'
              fill='rgba(255,255,255,0.45)'
              fontSize={12}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.12 }}
            >
              {days[i]}
            </motion.text>
            <motion.text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor='middle'
              fill='rgba(255,255,255,0.7)'
              fontSize={12}
              fontWeight={600}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.12 }}
            >
              {v}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}

function RadarChart({
  skills,
}: {
  skills: { label: string; value: number }[];
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 5;
  const maxR = 85;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const dataPoints = skills.map((s, i) => getPoint(i, s.value));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg width='100%' viewBox={`0 0 ${size} ${size}`} className='overflow-visible'>
      {/* grid rings */}
      {Array.from({ length: levels }, (_, i) => {
        const r = ((i + 1) / levels) * maxR;
        const pts = skills
          .map((_, j) => {
            const angle = angleStep * j - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          })
          .join(' ');
        return (
          <polygon
            key={i}
            points={pts}
            fill='none'
            stroke='rgba(255,255,255,0.06)'
            strokeWidth={1}
          />
        );
      })}
      {/* spokes */}
      {skills.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(angle)}
            y2={cy + maxR * Math.sin(angle)}
            stroke='rgba(255,255,255,0.06)'
            strokeWidth={1}
          />
        );
      })}
      {/* data polygon */}
      <defs>
        <linearGradient id='radarFill' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#6366f1' stopOpacity={0.35} />
          <stop offset='100%' stopColor='#a855f7' stopOpacity={0.15} />
        </linearGradient>
        <linearGradient id='radarStroke' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#818cf8' />
          <stop offset='100%' stopColor='#c084fc' />
        </linearGradient>
      </defs>
      <motion.polygon
        points={dataPath}
        fill='url(#radarFill)'
        stroke='url(#radarStroke)'
        strokeWidth={2}
        strokeLinejoin='round'
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* dots + labels */}
      {skills.map((s, i) => {
        const pt = getPoint(i, s.value);
        const labelPt = getPoint(i, 115);
        return (
          <g key={i}>
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill='#a78bfa'
              stroke='rgba(255,255,255,0.2)'
              strokeWidth={1.5}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 4 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor='middle'
              dominantBaseline='middle'
              fill='rgba(255,255,255,0.55)'
              fontSize={11}
              fontWeight={500}
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(date).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft('Now!');
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [date]);
  return <span className='text-xs font-medium text-indigo-300'>{timeLeft}</span>;
}

/* ─── Resume Breakdown Bar ─── */
function BreakdownBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className='space-y-1.5'>
      <div className='flex justify-between text-xs'>
        <span className='text-gray-400'>{label}</span>
        <span className='text-gray-300 font-medium'>{value}%</span>
      </div>
      <div className='h-2 rounded-full bg-white/5 overflow-hidden'>
        <motion.div
          className='h-full rounded-full'
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Applied: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    Screening: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
    Interviewing: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
    Offered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    Rejected: 'bg-red-500/15 text-red-300 border-red-500/20',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
        styles[status] || 'bg-white/10 text-gray-300 border-white/10'
      }`}
    >
      {status}
    </span>
  );
}

/* ─── DATA ─── */
const statsData = [
  {
    label: 'Applications',
    value: '47',
    change: '+12%',
    up: true,
    icon: Briefcase,
    color: '#3b82f6',
    sparkData: [2, 5, 3, 7, 4, 8, 6],
  },
  {
    label: 'Response Rate',
    value: '23%',
    change: '+8%',
    up: true,
    icon: Mail,
    color: '#8b5cf6',
    sparkData: [15, 18, 20, 17, 22, 21, 23],
  },
  {
    label: 'Interviews',
    value: '11',
    change: '+3',
    up: true,
    icon: CalendarCheck,
    color: '#a855f7',
    sparkData: [5, 7, 6, 9, 8, 10, 11],
  },
  {
    label: 'Offers',
    value: '2',
    change: '+1',
    up: true,
    icon: Award,
    color: '#10b981',
    sparkData: [0, 1, 0, 1, 1, 2, 2],
  },
];

const recentApplications = [
  { company: 'Stripe', role: 'Senior Frontend Engineer', status: 'Interviewing', date: 'Jun 12' },
  { company: 'Notion', role: 'Full Stack Developer', status: 'Applied', date: 'Jun 11' },
  { company: 'Figma', role: 'Design Engineer', status: 'Offered', date: 'Jun 10' },
  { company: 'Vercel', role: 'Solutions Engineer', status: 'Interviewing', date: 'Jun 9' },
  { company: 'Linear', role: 'Product Engineer', status: 'Applied', date: 'Jun 8' },
];

const pipelineStages = [
  { label: 'Applied', value: 47, color: '#3b82f6' },
  { label: 'Screening', value: 28, color: '#8b5cf6' },
  { label: 'Interview', value: 11, color: '#a855f7' },
  { label: 'Offer', value: 2, color: '#10b981' },
];

const aiInsights = [
  {
    icon: Target,
    text: 'Your response rate is 8% above average',
    sub: 'Keep up the momentum — your resume tailoring is working.',
  },
  {
    icon: Brain,
    text: 'Consider applying to more senior roles',
    sub: 'Based on your experience, you qualify for 67% more senior positions.',
  },
  {
    icon: Zap,
    text: 'Your resume score improved 12% this week',
    sub: 'Adding quantifiable achievements made the biggest impact.',
  },
];

const upcomingInterviews = [
  { company: 'Stripe', role: 'Senior Frontend Engineer', date: '2026-06-16T14:00:00' },
  { company: 'Vercel', role: 'Solutions Engineer', date: '2026-06-19T10:00:00' },
];

const quickActions = [
  { label: 'Build Resume', icon: FileText, color: 'from-blue-500 to-indigo-500' },
  { label: 'Generate Cover Letter', icon: PenTool, color: 'from-purple-500 to-pink-500' },
  { label: 'Practice Interview', icon: Mic, color: 'from-emerald-500 to-teal-500' },
];

const skillsData = [
  { label: 'Technical', value: 90 },
  { label: 'Communication', value: 82 },
  { label: 'Leadership', value: 75 },
  { label: 'Creativity', value: 70 },
  { label: 'Analytical', value: 85 },
  { label: 'Teamwork', value: 88 },
];

const resumeBreakdown = [
  { label: 'Content & Keywords', value: 92, color: '#6366f1' },
  { label: 'Formatting & Layout', value: 85, color: '#8b5cf6' },
  { label: 'ATS Compatibility', value: 90, color: '#a855f7' },
  { label: 'Impact & Metrics', value: 78, color: '#c084fc' },
  { label: 'Grammar & Clarity', value: 95, color: '#e879f9' },
];

/* ─── Glass Card wrapper ─── */
function GlassCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial='hidden'
      animate='visible'
      transition={{ delay, duration: 0.55 }}
      className={`relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 overflow-hidden ${className}`}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none' />
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className='min-h-screen bg-[#030712] flex items-center justify-center'>
        <div className='w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#030712] relative overflow-hidden'>
      {/* ── gradient orbs ── */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
        <div className='absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]' />
        <div className='absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]' />
        <div className='absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]' />
      </div>

      <Navbar />

      <main className='relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div variants={containerVariants} initial='hidden' animate='visible' className='space-y-8'>
          {/* ═══ WELCOME HEADER ═══ */}
          <motion.div variants={fadeUp} className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <motion.h1
                className='text-3xl sm:text-4xl font-bold tracking-tight'
                variants={fadeUp}
              >
                Welcome back,{' '}
                <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>
                  Alex
                </span>
              </motion.h1>
              <motion.p className='text-gray-400 mt-1 text-sm' variants={fadeUp}>
                {getTodayLabel()}
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className='flex items-center gap-3'>
              <div className='flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/20 bg-orange-500/10'>
                <Flame className='w-5 h-5 text-orange-400' />
                <span className='text-lg font-bold text-orange-300'>7</span>
                <span className='text-sm text-orange-300/70'>day streak</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══ STATS OVERVIEW ═══ */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {statsData.map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.07}>
                <div className='flex items-start justify-between mb-4'>
                  <div
                    className='w-10 h-10 rounded-xl flex items-center justify-center'
                    style={{ background: `${stat.color}20` }}
                  >
                    <stat.icon className='w-5 h-5' style={{ color: stat.color }} />
                  </div>
                  <div className='flex items-center gap-1'>
                    {stat.up ? (
                      <TrendingUp className='w-3.5 h-3.5 text-emerald-400' />
                    ) : (
                      <TrendingDown className='w-3.5 h-3.5 text-red-400' />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        stat.up ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <p className='text-sm text-gray-400 mb-1'>{stat.label}</p>
                <p className='text-2xl font-bold text-white'>{stat.value}</p>
                <div className='mt-3'>
                  <MiniSparkline data={stat.sparkData} color={stat.color} />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* ═══ 2-COLUMN: PIPELINE + RESUME SCORE ═══ */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            {/* Pipeline */}
            <GlassCard className='lg:col-span-2' delay={0.28}>
              <h2 className='text-lg font-semibold text-white mb-5'>Application Pipeline</h2>
              <div className='space-y-4'>
                {pipelineStages.map((stage, i) => (
                  <div key={stage.label}>
                    <div className='flex items-center justify-between mb-1.5'>
                      <span className='text-sm text-gray-300 font-medium'>{stage.label}</span>
                      <span className='text-sm text-gray-400'>{stage.value}</span>
                    </div>
                    <div className='h-3 rounded-full bg-white/5 overflow-hidden relative'>
                      <motion.div
                        className='h-full rounded-full relative'
                        style={{
                          background: `linear-gradient(90deg, ${stage.color}, ${stage.color}cc)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(stage.value / pipelineStages[0].value) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      >
                        <div
                          className='absolute inset-0 rounded-full opacity-60'
                          style={{
                            background: `linear-gradient(90deg, transparent, ${stage.color}66, transparent)`,
                          }}
                        />
                      </motion.div>
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div className='flex justify-center my-2'>
                        <ChevronRight className='w-4 h-4 text-gray-600 rotate-90' />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Funnel visualization */}
              <div className='mt-6 flex items-end justify-center gap-3'>
                {pipelineStages.map((stage, i) => {
                  const widths = [100, 70, 42, 18];
                  return (
                    <motion.div
                      key={stage.label}
                      className='relative rounded-lg overflow-hidden cursor-pointer group'
                      style={{
                        width: `${widths[i]}%`,
                        height: 52 + i * 8,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <div
                        className='absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity'
                        style={{
                          background: `linear-gradient(135deg, ${stage.color}, ${stage.color}99)`,
                        }}
                      />
                      <div className='relative z-10 h-full flex flex-col items-center justify-center px-2'>
                        <span className='text-white font-bold text-sm'>{stage.value}</span>
                        <span className='text-white/70 text-[10px]'>{stage.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Resume Score */}
            <GlassCard delay={0.35}>
              <h2 className='text-lg font-semibold text-white mb-2'>Resume Score</h2>
              <p className='text-xs text-gray-400 mb-6'>Overall ATS compatibility</p>
              <div className='flex justify-center mb-6'>
                <CircularGauge score={87} />
              </div>
              <div className='bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-3 mb-6 border border-indigo-500/20'>
                <p className='text-xs text-center text-indigo-300 font-medium'>
                  🎉 Great work! Score improved 12% this week
                </p>
              </div>
              <div className='space-y-3'>
                {resumeBreakdown.map((item, i) => (
                  <BreakdownBar key={item.label} {...item} />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ═══ 3-COLUMN: WEEKLY ACTIVITY + UPCOMING + SKILLS ═══ */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
            {/* Weekly Activity */}
            <GlassCard delay={0.42}>
              <div className='flex items-center justify-between mb-5'>
                <h2 className='text-lg font-semibold text-white'>Weekly Activity</h2>
                <span className='text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg'>This week</span>
              </div>
              <BarChart data={[3, 5, 2, 7, 4]} />
              <div className='mt-4 flex items-center justify-between text-xs text-gray-400'>
                <span>Total: 21 applications</span>
                <span className='text-emerald-400 font-medium flex items-center gap-1'>
                  <TrendingUp className='w-3 h-3' /> +18% vs last week
                </span>
              </div>
            </GlassCard>

            {/* Upcoming Interviews */}
            <GlassCard delay={0.49}>
              <h2 className='text-lg font-semibold text-white mb-5'>Upcoming Interviews</h2>
              <div className='space-y-4'>
                {upcomingInterviews.map((interview, i) => (
                  <motion.div
                    key={i}
                    className='relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4'
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center'>
                        <CalendarCheck className='w-4 h-4 text-indigo-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-white truncate'>{interview.company}</p>
                        <p className='text-xs text-gray-400 truncate'>{interview.role}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <CountdownTimer date={interview.date} />
                      <span className='text-[11px] text-gray-500'>
                        {new Date(interview.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className='mt-4 p-3 rounded-xl border border-dashed border-white/10 text-center cursor-pointer hover:border-indigo-500/30 transition-colors'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className='text-xs text-gray-400'>+ Schedule mock interview</span>
              </motion.div>
            </GlassCard>

            {/* Skills Radar */}
            <GlassCard delay={0.56}>
              <h2 className='text-lg font-semibold text-white mb-2'>Skills Profile</h2>
              <p className='text-xs text-gray-400 mb-4'>Based on resume & assessments</p>
              <div className='flex justify-center'>
                <RadarChart skills={skillsData} />
              </div>
              <div className='mt-4 grid grid-cols-2 gap-2'>
                {skillsData.slice(0, 4).map((skill) => (
                  <div
                    key={skill.label}
                    className='flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]'
                  >
                    <span className='text-[11px] text-gray-400'>{skill.label}</span>
                    <span className='text-[11px] font-semibold text-indigo-300'>{skill.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ═══ RECENT APPLICATIONS ═══ */}
          <GlassCard delay={0.63}>
            <div className='flex items-center justify-between mb-5'>
              <h2 className='text-lg font-semibold text-white'>Recent Applications</h2>
              <Button variant='ghost' size='sm' className='text-xs text-gray-400 hover:text-white'>
                View all <ArrowUpRight className='w-3 h-3 ml-1' />
              </Button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-left text-xs text-gray-500 border-b border-white/[0.06]'>
                    <th className='pb-3 font-medium'>Company</th>
                    <th className='pb-3 font-medium'>Role</th>
                    <th className='pb-3 font-medium'>Status</th>
                    <th className='pb-3 font-medium text-right'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app, i) => (
                    <motion.tr
                      key={i}
                      className='border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                    >
                      <td className='py-3.5'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300'>
                            {app.company[0]}
                          </div>
                          <span className='font-medium text-white'>{app.company}</span>
                        </div>
                      </td>
                      <td className='py-3.5 text-gray-300'>{app.role}</td>
                      <td className='py-3.5'>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className='py-3.5 text-right text-gray-400'>{app.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* ═══ AI INSIGHTS ═══ */}
          <div>
            <motion.div variants={fadeUp} className='flex items-center gap-2 mb-5'>
              <Sparkles className='w-5 h-5 text-indigo-400' />
              <h2 className='text-lg font-semibold text-white'>AI Insights</h2>
            </motion.div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              {aiInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial='hidden'
                  animate='visible'
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className='group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5 overflow-hidden hover:border-indigo-500/20 transition-all duration-300 cursor-pointer'
                >
                  <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none' />
                  <div className='relative z-10'>
                    <div className='w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4 group-hover:bg-indigo-500/25 transition-colors'>
                      <insight.icon className='w-5 h-5 text-indigo-400' />
                    </div>
                    <p className='text-sm font-medium text-white mb-2'>{insight.text}</p>
                    <p className='text-xs text-gray-400 leading-relaxed'>{insight.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ═══ QUICK ACTIONS ═══ */}
          <GlassCard delay={1.0}>
            <h2 className='text-lg font-semibold text-white mb-5'>Quick Actions</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  className='group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-left overflow-hidden hover:border-white/[0.12] transition-all duration-300'
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.08 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`}
                  />
                  <div className='relative z-10'>
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}
                    >
                      <action.icon className='w-5 h-5 text-white' />
                    </div>
                    <p className='text-sm font-medium text-white'>{action.label}</p>
                    <p className='text-[11px] text-gray-500 mt-1'>Get started →</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

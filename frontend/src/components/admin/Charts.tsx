import type { DailyPoint } from '@/types';
import { formatCompactINR } from '@/lib/format';

/**
 * Lightweight dependency-free SVG charts — keeps the bundle lean.
 */

interface RevenueChartProps {
  data: DailyPoint[];
}

export function RevenueAreaChart({ data }: RevenueChartProps) {
  const width = 720;
  const height = 240;
  const pad = { top: 20, right: 16, bottom: 28, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.revenue), 1);
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((d, i) => ({
    x: pad.left + i * stepX,
    y: pad.top + innerH - (d.revenue / max) * innerH,
    d,
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pad.left + innerW} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px]" role="img" aria-label="Revenue chart">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((g) => {
          const y = pad.top + innerH - g * innerH;
          return (
            <g key={g}>
              <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke="var(--border)" strokeDasharray="3 3" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">
                {formatCompactINR(g * max)}
              </text>
            </g>
          );
        })}

        <path d={area} fill="url(#revGrad)" />
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--primary)" />
            {i % Math.ceil(data.length / 7) === 0 && (
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
                {p.d.date.slice(5)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
}

export function CategoryBarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-medium">{formatCompactINR(d.value)}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

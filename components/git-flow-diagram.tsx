'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLORS = {
  main: '#e5484d',
  release: '#8e4ec6',
  dev: '#0091ff',
  feature: '#30a46c',
  hotfix: '#f76b15',
  tag: '#b98900',
};

type FlowType = 'release' | 'hotfix';

interface StepInfo {
  title: string;
  desc: string;
}

const STEPS: Record<FlowType, StepInfo[]> = {
  release: [
    { title: 'feature 분기', desc: 'dev에서 feature 브랜치를 분기하여 기능을 개발합니다.' },
    { title: 'dev로 머지', desc: '개발이 끝나면 feature 브랜치를 dev로 머지합니다.' },
    { title: 'release 분기', desc: '릴리즈 시점이 되면 dev에서 release 브랜치를 분기합니다.' },
    { title: 'main으로 머지', desc: 'release 브랜치를 main으로 머지합니다.' },
    { title: 'release tag 작성', desc: 'main에서 minor 버전을 올린 태그(vX.Y.0)를 작성하면 배포가 완료됩니다.' },
  ],
  hotfix: [
    { title: 'hotfix 분기', desc: 'main에서 hotfix 브랜치를 분기하여 긴급 수정을 진행합니다.' },
    { title: 'dev로 머지 후 QC', desc: '수정 내용을 dev로 머지하고 QC를 진행합니다.' },
    { title: 'main으로 머지', desc: 'QC를 통과하면 hotfix 브랜치를 main으로 머지합니다.' },
    { title: 'release tag 작성', desc: 'main에서 patch 버전을 올린 태그(vX.Y.Z)를 작성하면 배포가 완료됩니다.' },
  ],
};

/** step 도달 시 나타나는 요소 래퍼 (등장 애니메이션) */
function Appear({
  at,
  step,
  delay = 0,
  children,
}: {
  at: number;
  step: number;
  delay?: number;
  children: ReactNode;
}) {
  const visible = step >= at;
  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
      }}
    >
      {children}
    </g>
  );
}

/** step 도달 시 그려지는 선 (draw-in 애니메이션) */
function DrawPath({
  at,
  step,
  d,
  color,
  delay = 0,
  dashed = false,
}: {
  at: number;
  step: number;
  d: string;
  color: string;
  delay?: number;
  dashed?: boolean;
}) {
  const visible = step >= at;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      pathLength={100}
      strokeDasharray={dashed ? '0.01 6' : 100}
      strokeDashoffset={dashed ? 0 : visible ? 0 : 100}
      style={{
        opacity: dashed ? (visible ? 1 : 0) : 1,
        transition: dashed
          ? `opacity 0.5s ease ${delay}s`
          : `stroke-dashoffset 0.7s ease ${delay}s`,
      }}
    />
  );
}

function Commit({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={6.5} fill="var(--color-fd-card, #fff)" stroke={color} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={2.8} fill={color} />
    </>
  );
}

function LaneLabel({ x, y, text, color, active }: { x: number; y: number; text: string; color: string; active: boolean }) {
  return (
    <text
      x={x}
      y={y + 4}
      fontSize={13}
      fontWeight={700}
      fill={color}
      style={{ opacity: active ? 1 : 0.35, transition: 'opacity 0.45s ease', fontFamily: 'var(--font-mono, monospace)' }}
    >
      {text}
    </text>
  );
}

function TagBadge({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <rect x={x} y={y - 14} rx={7} ry={7} width={110} height={28} fill={COLORS.tag} opacity={0.15} stroke={COLORS.tag} strokeWidth={1.5} />
      <text x={x + 55} y={y + 5} fontSize={13} fontWeight={700} fill={COLORS.tag} textAnchor="middle" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
        🏷 {label}
      </text>
    </>
  );
}

function ReleaseScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 740 250" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="정규 릴리즈 흐름 도식">
      {/* 기본 레인 */}
      <line x1={80} y1={45} x2={725} y2={45} stroke={COLORS.main} strokeWidth={2.5} opacity={0.25} />
      <line x1={80} y1={155} x2={725} y2={155} stroke={COLORS.dev} strokeWidth={2.5} opacity={0.25} />
      <LaneLabel x={8} y={45} text="main" color={COLORS.main} active />
      <LaneLabel x={8} y={100} text="release" color={COLORS.release} active={step >= 3} />
      <LaneLabel x={8} y={155} text="dev" color={COLORS.dev} active />
      <LaneLabel x={8} y={210} text="feature" color={COLORS.feature} active={step >= 1} />
      <Commit x={105} y={155} color={COLORS.dev} />

      {/* ① dev → feature 분기, 기능 커밋 */}
      <DrawPath at={1} step={step} d="M135 155 C160 155 155 210 185 210" color={COLORS.feature} />
      <DrawPath at={1} step={step} d="M185 210 L330 210" color={COLORS.feature} delay={0.3} />
      <Appear at={1} step={step} delay={0.4}><Commit x={210} y={210} color={COLORS.feature} /></Appear>
      <Appear at={1} step={step} delay={0.6}><Commit x={260} y={210} color={COLORS.feature} /></Appear>
      <Appear at={1} step={step} delay={0.8}><Commit x={310} y={210} color={COLORS.feature} /></Appear>

      {/* ② feature → dev merge */}
      <DrawPath at={2} step={step} d="M330 210 C360 210 355 155 385 155" color={COLORS.feature} />
      <Appear at={2} step={step} delay={0.4}><Commit x={385} y={155} color={COLORS.dev} /></Appear>

      {/* ③ dev → release 분기 */}
      <DrawPath at={3} step={step} d="M415 155 C440 155 435 100 465 100" color={COLORS.release} />
      <DrawPath at={3} step={step} d="M465 100 L575 100" color={COLORS.release} delay={0.3} />
      <Appear at={3} step={step} delay={0.4}><Commit x={495} y={100} color={COLORS.release} /></Appear>
      <Appear at={3} step={step} delay={0.6}><Commit x={545} y={100} color={COLORS.release} /></Appear>

      {/* ④ release → main merge */}
      <DrawPath at={4} step={step} d="M575 100 C605 100 600 45 630 45" color={COLORS.release} />
      <Appear at={4} step={step} delay={0.4}><Commit x={630} y={45} color={COLORS.main} /></Appear>

      {/* ⑤ 태그 */}
      <Appear at={5} step={step} delay={0.2}><TagBadge x={585} y={18} label="v1.2.0" /></Appear>
    </svg>
  );
}

function HotfixScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 740 195" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="핫픽스 흐름 도식">
      <line x1={80} y1={45} x2={725} y2={45} stroke={COLORS.main} strokeWidth={2.5} opacity={0.25} />
      <line x1={80} y1={155} x2={725} y2={155} stroke={COLORS.dev} strokeWidth={2.5} opacity={0.25} />
      <LaneLabel x={8} y={45} text="main" color={COLORS.main} active />
      <LaneLabel x={8} y={100} text="hotfix" color={COLORS.hotfix} active={step >= 1} />
      <LaneLabel x={8} y={155} text="dev" color={COLORS.dev} active />
      <Commit x={105} y={45} color={COLORS.main} />

      {/* ① main → hotfix 분기, 수정 커밋 */}
      <DrawPath at={1} step={step} d="M135 45 C160 45 155 100 185 100" color={COLORS.hotfix} />
      <DrawPath at={1} step={step} d="M185 100 L430 100" color={COLORS.hotfix} delay={0.3} />
      <Appear at={1} step={step} delay={0.4}><Commit x={225} y={100} color={COLORS.hotfix} /></Appear>
      <Appear at={1} step={step} delay={0.6}><Commit x={275} y={100} color={COLORS.hotfix} /></Appear>

      {/* ② hotfix → dev merge, QC */}
      <DrawPath at={2} step={step} d="M300 100 C330 100 325 155 355 155" color={COLORS.hotfix} />
      <Appear at={2} step={step} delay={0.4}>
        <Commit x={355} y={155} color={COLORS.dev} />
        <text x={380} y={177} fontSize={12} fill="var(--color-fd-muted-foreground, #888)">QC 진행</text>
      </Appear>

      {/* ③ hotfix → main merge */}
      <DrawPath at={3} step={step} d="M430 100 C460 100 455 45 485 45" color={COLORS.hotfix} />
      <Appear at={3} step={step} delay={0.4}><Commit x={485} y={45} color={COLORS.main} /></Appear>

      {/* ④ 태그 */}
      <Appear at={4} step={step} delay={0.2}><TagBadge x={520} y={18} label="v1.2.1" /></Appear>
    </svg>
  );
}

export function GitFlowDiagram({ flow }: { flow: FlowType }) {
  const steps = STEPS[flow];
  const maxStep = steps.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= maxStep) {
          stop();
          return s;
        }
        return s + 1;
      });
    }, 1700);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, maxStep, stop]);

  const goTo = (next: number) => {
    stop();
    setStep(Math.max(0, Math.min(maxStep, next)));
  };

  return (
    <div className="not-prose my-6 rounded-xl border bg-card p-4 shadow-sm">
      {flow === 'release' ? <ReleaseScene step={step} /> : <HotfixScene step={step} />}

      {/* 단계 패널: 현재 진행 중인 줄이 강조됩니다 */}
      <ol className="mt-3 flex list-none flex-col gap-1 p-0">
        {steps.map((s, i) => {
          const idx = i + 1;
          const state = idx === step ? 'current' : idx < step ? 'done' : 'todo';
          return (
            <li key={idx} className="m-0 p-0">
              <button
                type="button"
                onClick={() => goTo(idx)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60',
                  state === 'current' && 'bg-accent text-accent-foreground',
                  state === 'todo' && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold',
                    state === 'current' && 'border-primary bg-primary text-primary-foreground',
                    state === 'done' && 'border-transparent bg-muted text-muted-foreground',
                    state === 'todo' && 'border-border text-muted-foreground',
                  )}
                >
                  {state === 'done' ? <Check className="size-3" /> : idx}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{s.title}</span>
                  {state === 'current' ? (
                    <span className="text-[13px] text-muted-foreground">{s.desc}</span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="처음부터"
          onClick={() => goTo(0)}
          disabled={step === 0}
        >
          <RotateCcw />
        </Button>
        <Button variant="outline" size="sm" onClick={() => goTo(step - 1)} disabled={step === 0}>
          <ChevronLeft />
          이전
        </Button>
        <Button variant="outline" size="sm" onClick={() => goTo(step + 1)} disabled={step === maxStep}>
          다음
          <ChevronRight />
        </Button>
        <Button
          size="sm"
          className="ml-1"
          onClick={() => {
            if (playing) {
              stop();
            } else {
              if (step >= maxStep) setStep(0);
              setPlaying(true);
            }
          }}
        >
          {playing ? <Pause /> : <Play />}
          {playing ? '일시정지' : '자동 재생'}
        </Button>
        <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
          {step} / {maxStep}
        </span>
      </div>
    </div>
  );
}

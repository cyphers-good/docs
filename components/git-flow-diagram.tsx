'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

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

  const btnStyle: React.CSSProperties = {
    padding: '4px 12px',
    borderRadius: 8,
    border: '1px solid var(--color-fd-border, #ddd)',
    background: 'var(--color-fd-secondary, transparent)',
    color: 'var(--color-fd-foreground, inherit)',
    fontSize: 13,
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        border: '1px solid var(--color-fd-border, #ddd)',
        borderRadius: 12,
        background: 'var(--color-fd-card, transparent)',
        padding: 16,
        margin: '16px 0',
      }}
    >
      {flow === 'release' ? <ReleaseScene step={step} /> : <HotfixScene step={step} />}

      {/* 단계 패널: 현재 진행 중인 줄이 강조됩니다 */}
      <ol style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {steps.map((s, i) => {
          const idx = i + 1;
          const state = idx === step ? 'current' : idx < step ? 'done' : 'todo';
          return (
            <li key={idx} style={{ margin: 0, padding: 0 }}>
              <button
                type="button"
                onClick={() => goTo(idx)}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'baseline',
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: state === 'current' ? 'var(--color-fd-primary\/10, rgba(120,120,255,0.08))' : 'transparent',
                  boxShadow: state === 'current' ? 'inset 3px 0 0 var(--color-fd-primary, #6366f1)' : 'none',
                  opacity: state === 'todo' ? 0.45 : 1,
                  transition: 'opacity 0.3s ease, background 0.3s ease',
                  color: 'var(--color-fd-foreground, inherit)',
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: state === 'done' ? 'var(--color-fd-muted-foreground, #888)' : 'var(--color-fd-primary, #6366f1)',
                    minWidth: 44,
                  }}
                >
                  {state === 'done' ? '✓' : ''} STEP {idx}
                </span>
                <span style={{ fontSize: 13.5 }}>
                  <strong>{s.title}</strong>
                  {state === 'current' ? <span style={{ color: 'var(--color-fd-muted-foreground, #888)' }}> · {s.desc}</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
        <button type="button" style={btnStyle} onClick={() => goTo(0)}>처음부터</button>
        <button type="button" style={btnStyle} onClick={() => goTo(step - 1)} disabled={step === 0}>◀ 이전</button>
        <button type="button" style={btnStyle} onClick={() => goTo(step + 1)} disabled={step === maxStep}>다음 ▶</button>
        <button
          type="button"
          style={{ ...btnStyle, fontWeight: 600 }}
          onClick={() => {
            if (playing) {
              stop();
            } else {
              if (step >= maxStep) setStep(0);
              setPlaying(true);
            }
          }}
        >
          {playing ? '⏸ 일시정지' : '▶ 자동 재생'}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-fd-muted-foreground, #888)' }}>
          {step} / {maxStep}
        </span>
      </div>
    </div>
  );
}

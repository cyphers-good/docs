'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StepInfo } from './primitives';

/**
 * 단계별 애니메이션 도식의 공용 셸.
 * 카드 컨테이너, 단계 패널(현재 단계 강조, 클릭 이동), 재생 컨트롤과 step 상태를 담당한다.
 * 장면은 render prop으로 받는다: 현재 step을 인자로 받아 SVG(또는 임의의 노드)를 반환한다.
 */
export function DiagramPlayer({
  steps,
  children,
  intervalMs = 1700,
}: {
  steps: StepInfo[];
  children: (step: number) => ReactNode;
  intervalMs?: number;
}) {
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
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, maxStep, stop, intervalMs]);

  const goTo = (next: number) => {
    stop();
    setStep(Math.max(0, Math.min(maxStep, next)));
  };

  return (
    <div className="not-prose my-6 rounded-xl border bg-card p-4 shadow-sm">
      {children(step)}

      {/* 단계 패널: 현재 진행 중인 줄이 강조된다 */}
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

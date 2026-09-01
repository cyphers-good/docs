'use client';

import { DiagramPlayer } from './diagram/player';
import { Appear, DrawPath, PALETTE, type StepInfo } from './diagram/primitives';
import { Commit, LaneLabel, LaneLine, TagBadge } from './diagram/lane';

const COLORS = {
  main: PALETTE.red,
  release: PALETTE.purple,
  dev: PALETTE.blue,
  feature: PALETTE.green,
  hotfix: PALETTE.orange,
};

type FlowType = 'release' | 'hotfix';

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

function ReleaseScene({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 740 250" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="정규 릴리즈 흐름 도식">
      <LaneLine x1={80} x2={725} y={45} color={COLORS.main} />
      <LaneLine x1={80} x2={725} y={155} color={COLORS.dev} />
      <LaneLabel x={8} y={45} text="main" color={COLORS.main} />
      <LaneLabel x={8} y={100} text="release" color={COLORS.release} active={step >= 3} />
      <LaneLabel x={8} y={155} text="dev" color={COLORS.dev} />
      <Commit x={105} y={155} color={COLORS.dev} />
      <LaneLabel x={8} y={210} text="feature" color={COLORS.feature} active={step >= 1} />

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
      <LaneLine x1={80} x2={725} y={45} color={COLORS.main} />
      <LaneLine x1={80} x2={725} y={155} color={COLORS.dev} />
      <LaneLabel x={8} y={45} text="main" color={COLORS.main} />
      <LaneLabel x={8} y={100} text="hotfix" color={COLORS.hotfix} active={step >= 1} />
      <LaneLabel x={8} y={155} text="dev" color={COLORS.dev} />
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
  return (
    <DiagramPlayer steps={STEPS[flow]}>
      {(step) => (flow === 'release' ? <ReleaseScene step={step} /> : <HotfixScene step={step} />)}
    </DiagramPlayer>
  );
}

---
name: animated-diagram
description: 문서에 단계별 애니메이션 도식(SVG 장면 + 단계 패널 + 재생 컨트롤)을 새로 만들거나 수정할 때 반드시 사용하는 스킬입니다. "애니메이션 도식 추가", "흐름을 애니메이션으로", "도식 수정", "다이어그램 만들어줘" 같은 요청과, doc-writing 스킬이 복잡한 흐름이라고 판단한 모든 경우에 이 스킬을 읽고 작업합니다. 공용 컴포넌트(components/diagram/) 사용 방법, 장면 유형 선택 기준, SVG 좌표·색상 규칙, 검증 절차를 담고 있습니다.
---

# 애니메이션 도식 생성 스킬

이 저장소의 애니메이션 도식은 "단계를 하나씩 진행하며 흐름을 이해시키는" 인터랙티브 컴포넌트입니다.
공용 부품이 `components/diagram/` 에 준비되어 있으므로, 새 도식을 만들 때는 **장면(Scene)만 작성**하면 됩니다.
프리미티브를 복사하거나 새로 구현하지 말고, 반드시 공용 모듈을 import해서 사용하십시오.

## 공용 모듈 구조 (components/diagram/)

| 파일 | 제공 요소 | 역할 |
| --- | --- | --- |
| `player.tsx` | `DiagramPlayer` | 카드, 단계 패널(강조·클릭 이동), 재생 컨트롤, step 상태를 모두 담당하는 셸입니다 |
| `primitives.tsx` | `Appear`, `DrawPath`, `ArrowMarker`, `PALETTE`, `StepInfo` | 등장·선 그리기 애니메이션과 공용 팔레트입니다 |
| `lane.tsx` | `LaneLine`, `LaneLabel`, `Commit`, `TagBadge` | 레인형(브랜치 흐름) 장면 부품입니다 |
| `sequence.tsx` | `SeqActor`, `SeqMessage`, `SeqActivation` | 시퀀스형(요청·응답 상호작용) 장면 부품입니다 |
| `timeline.tsx` | `TimelineTrack`, `TaskBlock`, `TimeMarker` | 타임라인형(시간 점유·동시성) 장면 부품입니다 |
| `flow.tsx` | `FlowNode`, `FlowEdge` | 플로우차트형(업무 절차) 장면 부품입니다 |
| `code-panel.tsx` | `CodeHighlight` | 단계별로 코드 줄을 강조하는 패널입니다 (장면 옆·아래 배치) |

## 장면 유형 선택 기준

다루는 주제에 따라 다음 유형을 선택합니다.

| 주제 | 장면 유형 | 사용할 부품 |
| --- | --- | --- |
| 브랜치 전략, 병렬 트랙의 분기·병합 | 레인형 | `lane.tsx` (기준 예시: `components/git-flow-diagram.tsx`) |
| 서버/클라이언트 상호작용, API 호출 흐름, 인증 절차 | 시퀀스형 | `sequence.tsx` |
| 동시성·비동시성 비교, 메인 스레드 점유, 렌더 성능 | 타임라인형 | `timeline.tsx` (+ 코드 설명이 필요하면 `code-panel.tsx`) |
| 업무 절차, 승인·QC 흐름, 의사결정 분기 | 플로우차트형 | `flow.tsx` |

애니메이션 진행 방식은 클릭·자동 재생만 사용합니다. 스크롤 연동 방식은 문서 사이트에서 목차 이동·검색 진입과 충돌하고
사용자가 진행 속도를 제어할 수 없으므로 도입하지 않습니다.

## 새 도식을 추가하는 절차

1. 기준 예시인 `components/git-flow-diagram.tsx` 를 먼저 읽고 구조를 파악합니다.
2. 단계를 설계합니다. **한 단계는 하나의 의미 있는 변화**만 담습니다 (요청 하나, 머지 하나, 작업 블록 하나). 단계 수는 3~6개가 적당합니다.
3. `components/<주제>-diagram.tsx` 를 만들고 `'use client'` 를 선언합니다.
   `StepInfo[]` 로 단계 데이터를 정의하고, `DiagramPlayer` 의 render prop 안에서 현재 step을 받아 장면을 그립니다.

   ```tsx
   export function MyDiagram() {
     return (
       <DiagramPlayer steps={STEPS}>
         {(step) => <svg viewBox="0 0 740 220">…장면…</svg>}
       </DiagramPlayer>
     );
   }
   ```

4. 장면의 각 요소에 `at={단계 번호}` 를 지정합니다. 같은 단계 안에서 순차 등장이 필요하면 `delay` 를 0.2~0.3초 간격으로 늘립니다.
   화살표가 필요하면 SVG의 `<defs>` 에 `ArrowMarker` 를 넣고 `markerId` 로 참조합니다.
5. `mdx-components.tsx` 에 컴포넌트를 등록한 후, MDX에서 `<컴포넌트명 />` 으로 사용합니다.
6. 아래 검증 절차를 수행합니다.

## SVG 좌표·색상 규칙

- `viewBox` 는 가로 720~740 기준으로 잡고, 스타일은 `width: 100%` 로 반응형이 되게 합니다.
- 시간·진행은 왼쪽에서 오른쪽(시퀀스형은 위에서 아래)으로 흐릅니다. 레인·트랙 간격은 55px 내외로 유지합니다.
- 색상은 `PALETTE` 를 재사용하고, 의미가 같은 주체에는 문서 전체에서 같은 색을 씁니다
  (예: 클라이언트 `PALETTE.blue`, 서버 `PALETTE.green`, DB `PALETTE.purple`, 경고 `PALETTE.orange`, 오류·차단 `PALETTE.red`).
- 텍스트·보조선은 라이트/다크 양쪽에서 보이도록 Fumadocs 변수(`var(--color-fd-muted-foreground)` 등)를 사용합니다.
- 카드·버튼·패널의 색은 `DiagramPlayer` 가 shadcn 토큰으로 처리하므로 장면에서 신경 쓸 필요가 없습니다.

## 애니메이션 원칙

- 등장 전환 0.45초, 선 그리기 0.7초를 기준으로 합니다. 더 길면 답답하고, 더 짧으면 눈이 따라가지 못합니다.
- 자동 재생 간격은 기본 1.7초입니다. 단계 설명이 길면 `DiagramPlayer` 의 `intervalMs` 로 늘립니다.
- 단계 패널의 번호·설명은 도식 진행과 반드시 일치해야 합니다. `StepInfo[]` 하나를 도식과 패널이 공유하는 구조를 유지하십시오.
- 코드 설명이 필요한 단계에서는 `CodeHighlight` 에 단계별 강조 줄 매핑을 넘겨서 장면과 동기화합니다.

## 검증 절차

1. `npm run build` 가 통과하는지 확인합니다.
2. Playwright로 실제 렌더링을 확인합니다. 정적 빌드를 로컬 서버로 띄우고, "다음" 버튼을 끝까지 눌러 마지막 단계의 스크린샷을 찍어 확인합니다.

```bash
python3 -m http.server 3005 -d out &
# playwright 스크립트에서 executablePath: '/opt/pw-browsers/chromium' 사용
```

3. 중간 단계 하나를 클릭으로 이동해보고, 강조 표시와 도식 상태가 일치하는지 확인합니다.

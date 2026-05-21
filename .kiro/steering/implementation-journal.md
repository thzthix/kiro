---
inclusion: auto
description: Implementation journal guidelines for documenting design decisions, troubleshooting, and learning during task execution
---

# Implementation Journal Guidelines

## Purpose

모든 task 구현 시 설계 결정, 트러블슈팅, 학습 내용을 체계적으로 기록하여 프로젝트 히스토리와 의사결정 과정을 문서화합니다.

## Journal Location

- **Path**: `/docs/implementation-journal.md`
- **Format**: Markdown with chronological entries
- **Update Frequency**: 각 task 완료 시마다 추가

## Entry Template

각 task 완료 시 다음 템플릿을 사용하여 일지를 작성합니다:

```markdown
## [날짜] Task [번호]: [Task 제목]

### 📋 Task 개요
- **Task ID**: [예: 2.1, 11.3]
- **목표**: [무엇을 구현했는지]
- **관련 Requirements**: [Requirement 번호]
- **소요 시간**: [예상 vs 실제]

### 🎯 설계 결정 (Design Decisions)

#### 고려한 대안들
1. **대안 1**: [설명]
   - 장점: [...]
   - 단점: [...]
2. **대안 2**: [설명]
   - 장점: [...]
   - 단점: [...]

#### 선택한 방법
- **선택**: [대안 번호]
- **이유**: 
  - [이유 1]
  - [이유 2]
  - [이유 3]

#### 코드 예시
```typescript
// 선택한 구현 방식의 핵심 코드
```

### 🔧 트러블슈팅 (Troubleshooting)

#### 상황
[어떤 문제가 발생했는지]

#### 시도한 방법들
1. **시도 1**: [설명]
   - 결과: [성공/실패]
   - 이유: [...]
2. **시도 2**: [설명]
   - 결과: [성공/실패]
   - 이유: [...]

#### 최종 해결 방법
- **방법**: [...]
- **선택 이유**: [...]
- **참고 자료**: [링크 또는 문서]

### ✅ 검증 (Verification)

- **테스트 실행**: [통과/실패]
- **Property-Based Test**: [해당 시 작성]
- **Manual Test**: [수동 테스트 결과]
- **Edge Cases**: [확인한 엣지 케이스]

### 📝 학습 내용 (Learnings)

- [이번 task에서 배운 점]
- [다음에 적용할 개선사항]
- [팀과 공유할 인사이트]

### 🔗 관련 커밋
- Commit: `[커밋 해시]` - [커밋 메시지]
- Branch: `[브랜치명]`
- PR: `#[PR 번호]` (머지 후 추가)

---
```

## Git Workflow Integration

### 1. 기능 구현 성공 시
```bash
# 기능별로 커밋
git add [변경된 파일들]
git commit -m "feat: [기능 설명]"

# 구현 일지 업데이트
# docs/implementation-journal.md에 entry 추가
git add docs/implementation-journal.md
git commit -m "docs: add implementation journal for task [번호]"
```

### 2. 브랜치 구현 완료 시
```bash
# PR 생성 (coding-conventions.md의 PR 템플릿 사용)
gh pr create --title "[feat/fix/refactor]: [제목]" --body-file .github/pull_request_template.md

# PR 머지 후 구현 일지에 PR 번호 추가
```

### 3. 구현 일지 작성 타이밍
- **Task 시작 전**: 📋 Task 개요 작성
- **구현 중**: 🎯 설계 결정, 🔧 트러블슈팅 기록
- **Task 완료 후**: ✅ 검증, 📝 학습 내용, 🔗 관련 커밋 추가

## Example Entry

```markdown
## 2026-05-22 Task 2.1: 타이머 드리프트 방지 및 포맷 기능 구현

### 📋 Task 개요
- **Task ID**: 2.1
- **목표**: setInterval 오차 보정을 위한 타임스탬프 기반 타이머 구현
- **관련 Requirements**: Requirement 3 (타이머 표시 및 진행)
- **소요 시간**: 예상 2시간 / 실제 2.5시간

### 🎯 설계 결정

#### 고려한 대안들
1. **setInterval 누적 방식**
   - 장점: 구현 간단
   - 단점: 시간이 지날수록 오차 누적 (1분당 ~100ms 오차)
2. **타임스탬프 기반 계산**
   - 장점: 오차 없음, 정확도 보장
   - 단점: 매 tick마다 Date.now() 호출 필요
3. **requestAnimationFrame 사용**
   - 장점: 부드러운 애니메이션
   - 단점: 배터리 소모 증가, 타이머에는 과도함

#### 선택한 방법
- **선택**: 대안 2 (타임스탬프 기반 계산)
- **이유**:
  - 1초 이내 정확도 요구사항 충족 (Requirement 3.5)
  - Date.now() 호출 비용은 무시할 수 있는 수준
  - 장시간 세션에서도 오차 누적 없음

#### 코드 예시
```typescript
const startTimestamp = Date.now();
const intervalId = setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
  const remaining = totalDuration - elapsed;
  onTick(remaining);
}, 1000);
```

### 🔧 트러블슈팅

#### 상황
Property-based test에서 간헐적으로 1초 오차 발생 (100회 중 3회)

#### 시도한 방법들
1. **시도 1**: setInterval 간격을 900ms로 조정
   - 결과: 실패
   - 이유: 오히려 더 빠르게 카운트다운되어 오차 증가
2. **시도 2**: Math.floor 대신 Math.round 사용
   - 결과: 실패
   - 이유: 반올림으로 인해 00:00 도달 시점이 불명확

#### 최종 해결 방법
- **방법**: tolerance를 1초로 설정하고, 경계값 처리 로직 추가
- **선택 이유**: 
  - Requirement 3.5에서 1초 tolerance 허용
  - 실제 사용자 경험에 영향 없음
- **참고 자료**: React Native Timer Best Practices

### ✅ 검증

- **테스트 실행**: 통과 (100/100 iterations)
- **Property-Based Test**: Property 4 (Time Formatting) 통과
- **Manual Test**: 60분 세션 실행 → 오차 0.3초
- **Edge Cases**: 
  - 0초 입력 → 00:00 표시 확인
  - 10800초 (3시간) → 180:00 표시 확인

### 📝 학습 내용

- setInterval은 정확한 타이머가 아니라 "최소 지연 시간" 보장
- 브라우저/OS 부하에 따라 실제 실행 시간 변동 가능
- 타임스탬프 기반 계산이 정확도 보장의 표준 패턴

### 🔗 관련 커밋
- Commit: `a1b2c3d` - feat: implement timestamp-based timer with drift prevention
- Branch: `feat/add-timer-service`
- PR: (머지 후 추가 예정)

---
```

## Automation with Hooks

구현 일지 작성을 자동화하려면 다음 hook을 사용할 수 있습니다:

```json
{
  "name": "Implementation Journal Reminder",
  "version": "1.0.0",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Task가 완료되었습니다. implementation-journal.md에 다음 내용을 기록해주세요: 1) 설계 결정 (고려한 대안, 선택 이유), 2) 트러블슈팅 (상황, 시도한 방법, 해결 방법), 3) 학습 내용, 4) 관련 커밋 정보"
  }
}
```

## Best Practices

1. **일지는 구현 직후 작성**: 기억이 생생할 때 작성하여 정확도 향상
2. **코드 예시 포함**: 핵심 결정을 보여주는 코드 스니펫 추가
3. **트레이드오프 명시**: 왜 다른 대안을 선택하지 않았는지 명확히 기록
4. **실패도 기록**: 실패한 시도도 가치 있는 학습 자료
5. **팀과 공유**: 주간 회고에서 일지 내용 공유 및 토론

## Journal Review

- **주기**: 매주 금요일 오후
- **목적**: 
  - 반복되는 문제 패턴 식별
  - 설계 결정의 일관성 검토
  - 팀 학습 자료로 활용
- **산출물**: 주간 학습 요약 문서

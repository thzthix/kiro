---
inclusion: manual
---

# PR Template

모든 Pull Request는 다음 템플릿을 따라야 합니다.

## 변경 목적 (Why)
[작업의 목적과 배경을 명확히 설명]
- 어떤 문제를 해결하는가?
- 왜 이 변경이 필요한가?
- TDD 방법론의 어느 단계인가? (RED/GREEN/REFACTOR)

## 변경 내용 (What)
### [작업명] (Tasks X.X-X.X)
- ✅ [세부 작업 1]
- ✅ [세부 작업 2]
- ✅ [세부 작업 3]

주요 기능:
- [기능 1 설명]
- [기능 2 설명]
- [기능 3 설명]

## Scope Check
- [ ] PR이 하나의 목적을 가진다
- [ ] 불필요한 변경이 포함되지 않았다
- [ ] 관련 없는 리팩토링이 포함되지 않았다

## 검증 방법 (How to test)
실행한 테스트:
- [ ] focused test 실행 (해당 모듈만)
- [ ] full test suite 실행 (전체)
- [ ] manual check 실행 (UI가 있는 경우)

테스트 명령:
```bash
npm test -- [파일명].test.ts --no-coverage
npm test -- --no-coverage
npm run type-check
```

테스트 결과:
- [모듈명]: X/X 통과
- 전체: X/X 테스트 통과 ✅
- 타입 체크: 통과 ✅

## 영향 범위 (Impact)
- 기존 기능 영향: [있음/없음]
- 영향 받는 모듈: [목록]
- Breaking changes: [있음/없음]

## 설계 판단 / 고려 사항
### [주요 설계 결정 1]
- 이유: [설명]
- 대안: [고려한 다른 방법]
- 선택 근거: [왜 이 방법을 선택했는가]

### [주요 설계 결정 2]
- 이유: [설명]
- 트레이드오프: [장단점]

## Known Limitations
- [알려진 제한사항 1]
- [알려진 제한사항 2]
- [다음 단계에서 해결할 사항]

## 기본 규칙 체크
- [ ] 하드코딩된 경로 없음
- [ ] debug print 없음 (console.log 제거)
- [ ] 함수가 과도하게 길지 않음 (50줄 이하 권장)
- [ ] 한 파일 한 책임 원칙 유지
- [ ] TypeScript 타입 안정성 확보 (no any types)
- [ ] 주석이 코드와 일치함
- [ ] 불필요한 주석 제거됨

## TODO
- [ ] Task X.X: [다음 작업]
- [ ] Task X.X: [다음 작업]

---

## 예시

### 변경 목적 (Why)
TDD 방법론에 따라 TimerService 모듈을 RED-GREEN-REFACTOR 사이클로 구현합니다. 타이머 드리프트 방지, 일시정지/재개 기능, 정확한 콜백 트리거를 제공하는 핵심 타이머 서비스입니다.

### 변경 내용 (What)
#### TimerService (Tasks 3.1-3.4)
- ✅ Property tests 작성 (RED): 일시정지-재개 시 시간 보존 검증
- ✅ Unit tests 작성 (RED): 초기화, 틱 정확도, 일시정지, 재개, 중지, 완료 콜백
- ✅ 구현 (GREEN): start, pause, resume, stop, getRemainingTime 메서드
- ✅ 리팩토링 (REFACTOR): 헬퍼 메서드 분리, 상수 추출

주요 기능:
- 타임스탬프 기반 계산으로 드리프트 방지
- 1초 간격 setInterval로 정확한 틱
- 일시정지 시 남은 시간 보존 및 재개 시 복원
- onTick 콜백: 매초 남은 시간 전달
- onComplete 콜백: 00:00 도달 시 1회만 호출
- 리소스 정리: stop 시 interval 및 메모리 해제

### Scope Check
- [x] PR이 하나의 목적을 가진다 (TimerService 모듈 구현)
- [x] 불필요한 변경이 포함되지 않았다

### 검증 방법 (How to test)
실행한 테스트:
- [x] focused test 실행 (TimerService.test.ts)
- [x] full test suite 실행
- [x] manual check 실행 (비즈니스 로직만 구현, UI 없음)

테스트 명령:
```bash
npm test -- TimerService.test.ts --no-coverage
npm test -- --no-coverage
```

테스트 결과:
- TimerService: 15/15 통과
  - 2 property-based tests (150 runs total)
  - 13 unit tests
- 전체: 44/44 테스트 통과 ✅

### 영향 범위 (Impact)
- 기존 기능 영향 없음 (새로운 모듈 추가)

### 설계 판단 / 고려 사항
#### 타임스탬프 기반 계산
- setInterval의 누적 오차를 방지하기 위해 시작 타임스탬프 기준으로 계산
- 1초 허용 오차 내에서 정확도 보장

#### 일시정지/재개 메커니즘
- 일시정지 시: interval 정리 + 남은 시간 저장
- 재개 시: 새 시작 타임스탬프 설정 + 남은 시간을 새 totalDuration으로 사용
- 여러 번 일시정지/재개해도 시간 보존 (Property 5 검증)

### Known Limitations
- UI 컴포넌트 미구현 (다음 단계에서 진행)
- React Context 통합 미완료 (Task 5에서 진행)
- Custom hooks 미구현 (Task 6에서 진행)

### 기본 규칙 체크
- [x] 하드코딩된 경로 없음
- [x] debug print 없음
- [x] 함수가 과도하게 길지 않음 (모두 50줄 이하)
- [x] 한 파일 한 책임 원칙 유지
- [x] TypeScript 타입 안정성 확보 (no any types)

### TODO
- [ ] Task 4: Checkpoint - 모든 테스트 통과 확인
- [ ] Task 5: State management (Context + Reducer)
- [ ] Task 6: Custom hooks (useTimer, useStudySession)
- [ ] Task 7+: UI 컴포넌트 구현

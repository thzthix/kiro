---
inclusion: auto
---

# Coding Conventions & Standards

## Git Workflow

### Branch Naming
- **Feature branches**: `feat/add-{feature-name}` (예: `feat/add-schema`, `feat/add-timer-service`)
- **Bug fixes**: `fix/{bug-description}` (예: `fix/timer-drift`)
- **Refactoring**: `refactor/{component-name}` (예: `refactor/state-manager`)
- **Chores**: `chore/{task-description}` (예: `chore/setup-testing`)

### Branch Strategy (기능 단위 분리)

**✅ 권장 패턴: 하나의 브랜치 = 하나의 기능/모듈**
- PR 크기를 작게 유지 (리뷰 용이)
- 문제 발생 시 롤백 쉬움
- 브랜치 이름과 PR 내용 일치

**좋은 예시:**
```
feat/add-timer-service          (TimerService 모듈만)
feat/add-state-management       (Context + Reducer만)
feat/add-timer-hook             (useTimer hook만)
feat/add-study-session-hook     (useStudySession hook만)
feat/add-time-input-popup       (TimeInputPopup 컴포넌트만)
```

**❌ 피해야 할 패턴:**
```
feat/add-validator              (실제로는 3개 모듈 포함 - 너무 큼)
feat/business-logic             (범위가 불명확)
feat/implement-everything       (너무 광범위)
```

### Commit Messages (한글 사용)
**모든 커밋 메시지는 한글로 작성합니다.**

Conventional commit format 사용:
- `feat:` - 새로운 기능 추가 (예: `feat: 타이머 서비스 구현`, `feat: 거북이 캐릭터 컴포넌트 추가`)
- `fix:` - 버그 수정 (예: `fix: 타이머 드리프트 문제 해결`, `fix: 일시정지 시 상태 복원 오류 수정`)
- `refactor:` - 코드 리팩토링 (예: `refactor: StateTransitionManager 로직 개선`)
- `chore:` - 빌드, 설정 등 (예: `chore: Jest 설정 추가`, `chore: ESLint 규칙 업데이트`)
- `test:` - 테스트 추가/수정 (예: `test: InputValidator 프로퍼티 테스트 추가`)
- `docs:` - 문서 수정 (예: `docs: README 업데이트`, `docs: 구현 일지 작성`)

**커밋 메시지 작성 규칙:**
- 제목은 50자 이내로 간결하게
- 본문이 필요한 경우 제목과 본문 사이 빈 줄 추가
- 본문에는 "무엇을", "왜" 변경했는지 설명
- 이슈 번호가 있다면 본문 마지막에 추가 (예: `Closes #123`)

## Pull Request Template (한글 사용)

**모든 PR 제목과 본문은 한글로 작성합니다.**

### PR 제목 형식
- `[feat] 타이머 서비스 구현`
- `[fix] 일시정지 시 상태 복원 오류 수정`
- `[refactor] StateTransitionManager 로직 개선`

### PR 본문 구조

모든 PR은 다음 구조를 따릅니다:

### 변경 목적 (Why)
- 이 변경이 필요한 이유를 명확히 설명
- 해결하려는 문제나 추가하려는 가치 설명

### 변경 내용 (What)
- 구체적인 변경 사항을 bullet point로 나열
- 코드 레벨의 변경 내용 요약

### Scope Check
- [ ] PR이 하나의 목적을 가진다
- [ ] 불필요한 변경이 포함되지 않았다

### 검증 방법 (How to test)
**실행한 테스트:**
- [ ] focused test 실행
- [ ] related module test 실행
- [ ] full test suite 실행
- [ ] manual check 실행

**실행하지 못한 테스트가 있다면 이유를 작성:**
(이유 작성)

**테스트 명령:**
```bash
npm run test
npm run build
```

**테스트 케이스:**
- (구체적인 테스트 케이스 나열)

**결과:**
- (테스트 결과 요약)

### 영향 범위 (Impact)
- [ ] 기존 기능 영향 없음
- [ ] 일부 로직 변경 있음 (설명 필요)

**설명:**
(변경이 있다면 구체적으로 설명)

### 설계 판단 / 고려 사항
- 주요 설계 결정과 그 이유
- 대안을 고려했다면 왜 현재 방식을 선택했는지

### Known Limitations
- 알려진 제약사항이나 향후 개선이 필요한 부분

### 기본 규칙 체크
- [ ] 하드코딩된 경로 없음
- [ ] debug print 없음 (console.log 등)
- [ ] 함수가 과도하게 길지 않음 (50줄 이하 권장)
- [ ] 한 파일 한 책임 원칙 유지
- [ ] TypeScript 타입 안정성 확보

### TODO
- 향후 개선 사항이나 후속 작업

## Code Quality Standards

### TypeScript
- **모든 코드는 TypeScript로 작성**
- `any` 타입 사용 금지 (불가피한 경우 주석으로 이유 설명)
- 명시적 타입 선언 권장
- Interface 우선, Type alias는 필요시에만

### File Organization
```
/src
  /types        # TypeScript interfaces and types
  /utils        # Business logic modules (pure functions)
  /components   # React components
  /hooks        # Custom React hooks
  /context      # React Context providers
  /screens      # Screen components
```

### Naming Conventions
- **Components**: PascalCase (예: `TurtleCharacter`, `TimeInputPopup`)
- **Hooks**: camelCase with `use` prefix (예: `useTimer`, `useStudySession`)
- **Utils/Functions**: camelCase (예: `validateTimeInput`, `calculateProgress`)
- **Constants**: UPPER_SNAKE_CASE (예: `MAX_DURATION`, `HAPPY_STATE_DURATION`)
- **Interfaces**: PascalCase with descriptive name (예: `SessionState`, `TimerState`)

### Function Guidelines
- **함수는 50줄 이하 권장**
- 한 함수는 한 가지 일만 수행
- Pure functions 우선 (side effects 최소화)
- 복잡한 로직은 작은 함수로 분리

### Testing Requirements
- **모든 비즈니스 로직은 테스트 필수**
- Property-based tests for universal properties (fast-check 사용)
- Unit tests for specific cases and edge cases
- Integration tests for component interactions
- Test file naming: `{module}.test.ts` or `{component}.test.tsx`

### Code Cleanliness
- **No hardcoded paths** - 환경변수나 설정 파일 사용
- **No debug prints** - console.log, console.error 등 제거 (logger 사용)
- **No commented-out code** - 불필요한 코드는 삭제
- **No unused imports** - 사용하지 않는 import 제거

### React Native Specific
- **useNativeDriver: true** for animations (성능 최적화)
- Touch targets minimum **44x44 points** (접근성)
- Debounce user interactions (500ms 권장)
- Optimize re-renders with React.memo, useMemo, useCallback

### Error Handling
- 모든 async 함수는 try-catch 사용
- 사용자에게 의미있는 에러 메시지 표시
- 에러 발생 시 앱이 크래시되지 않도록 방어 코드 작성
- Fallback UI 제공 (예: 이미지 로드 실패 시 solid color)

### Performance Considerations
- Timer accuracy: calculate from start timestamp (not accumulating intervals)
- Turtle position updates: 200-300ms interval (battery efficiency)
- Animation transitions: 500ms or less
- Touch feedback: within 100ms

## Linting & Formatting

### ESLint Rules
```json
{
  "extends": [
    "@react-native-community",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "error",
    "no-debugger": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "max-lines-per-function": ["warn", 50]
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Pre-commit Checklist
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 경고/에러 없음
- [ ] 모든 테스트 통과
- [ ] console.log 등 debug print 제거
- [ ] 불필요한 주석 제거
- [ ] 커밋 메시지가 컨벤션을 따름

## Architecture Principles

### Separation of Concerns
- **Business logic** (utils): Pure functions, no React dependencies
- **State management** (context): Global state and reducers
- **UI components**: Presentation only, minimal logic
- **Hooks**: Reusable stateful logic

### Single Responsibility
- 한 파일은 한 가지 책임만
- 한 컴포넌트는 한 가지 UI 요소만
- 한 함수는 한 가지 작업만

### Dependency Direction
```
Screens → Hooks → Context + Components
Components → Utils (business logic)
```

### State Management
- React Context for global state
- Local state (useState) for component-specific state
- Reducers for complex state transitions
- No prop drilling (use Context)

## Documentation
- 복잡한 로직은 주석으로 설명
- Public API는 JSDoc 작성
- README에 프로젝트 구조와 실행 방법 문서화
- 주요 설계 결정은 ADR (Architecture Decision Record) 작성 고려

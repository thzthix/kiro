# Implementation Journal

## 2025-01-XX Task 1: 프로젝트 구조 및 핵심 타입 설정

### 📋 Task 개요
- **Task ID**: 1
- **목표**: React Native 프로젝트 초기화, TypeScript 설정, 폴더 구조 생성, 핵심 인터페이스 정의, Jest 및 fast-check 테스트 환경 구성, ESLint 및 Prettier 설정
- **관련 Requirements**: 전체 프로젝트 기반 설정
- **소요 시간**: 약 2시간

### 🎯 설계 결정 (Design Decisions)

#### 고려한 대안들

1. **React Native CLI vs Expo**
   - **React Native CLI**:
     - 장점: 네이티브 모듈 완전 제어, 커스터마이징 자유도 높음
     - 단점: 초기 설정 복잡, 네이티브 빌드 환경 필요
   - **Expo**:
     - 장점: 빠른 시작, 간편한 개발 환경
     - 단점: 네이티브 모듈 제한, 앱 크기 증가

2. **수동 프로젝트 설정 vs CLI 자동 생성**
   - **수동 설정**:
     - 장점: 필요한 것만 설치, 의존성 최소화, 구조 완전 제어
     - 단점: 초기 설정 시간 소요
   - **CLI 자동 생성**:
     - 장점: 빠른 시작, 검증된 설정
     - 단점: 불필요한 보일러플레이트, 커스터마이징 필요

3. **TypeScript 설정 수준**
   - **Strict Mode (선택)**:
     - 장점: 타입 안정성 최대화, 런타임 에러 사전 방지
     - 단점: 초기 개발 속도 약간 느림
   - **Loose Mode**:
     - 장점: 빠른 개발
     - 단점: 타입 안정성 낮음, `any` 남용 가능성

#### 선택한 방법

- **선택**: 수동 프로젝트 설정 + React Native CLI + TypeScript Strict Mode
- **이유**:
  1. **수동 설정**: 프로젝트 요구사항에 맞는 최소한의 의존성만 설치하여 프로젝트 크기 최소화
  2. **React Native CLI**: 네이티브 애니메이션 및 성능 최적화가 중요한 프로젝트 특성상 네이티브 제어 필요
  3. **Strict TypeScript**: 설계 문서에서 명시한 "no `any` types" 요구사항 충족
  4. **Jest + fast-check**: 설계 문서에서 요구하는 property-based testing 지원

#### 핵심 구조

```
/src
  /types        # 모든 TypeScript 인터페이스 중앙 관리
  /utils        # 순수 함수 비즈니스 로직 (React 의존성 없음)
  /components   # 재사용 가능한 UI 컴포넌트
  /hooks        # 커스텀 React hooks
  /context      # 전역 상태 관리 (Context API)
  /screens      # 화면 컴포넌트
```

#### 코드 예시

**핵심 타입 정의 (src/types/index.ts)**:
```typescript
export interface SessionState {
  totalDuration: number;
  remainingTime: number;
  status: SessionStatus;
  turtleState: TurtleState;
  eatingStateEndTime: number | null;
  happyStateEndTime: number | null;
  previousStateBeforePause: 'walking' | 'eating' | 'happy' | null;
  remainingEatingDuration: number | null;
  remainingHappyDuration: number | null;
  carrotCount: number;
  waterCount: number;
}
```

**TypeScript 설정 (tsconfig.json)**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    // ... 모든 strict 옵션 활성화
  }
}
```

### 🔧 트러블슈팅 (Troubleshooting)

#### 상황 1: React Native CLI 초기화 실패
`react-native init` 명령어가 deprecated되어 실행 실패

**시도한 방법들**:
1. **시도 1**: `npx react-native@latest init` 사용
   - 결과: 실패
   - 이유: 명령어가 deprecated되어 더 이상 지원되지 않음
2. **시도 2**: `@react-native-community/cli` 사용
   - 결과: 실패
   - 이유: 템플릿 파일 구조 문제 발생

**최종 해결 방법**:
- **방법**: 수동으로 package.json 생성 후 필요한 패키지만 설치
- **선택 이유**: 
  - CLI 도구의 불안정성 회피
  - 프로젝트 요구사항에 맞는 최소 의존성 구성
  - 더 나은 제어와 이해도
- **참고 자료**: React Native 공식 문서, npm 패키지 문서

#### 상황 2: TypeScript NodeJS.Timeout 타입 에러
`NodeJS.Timeout` 타입을 찾을 수 없다는 에러 발생

**시도한 방법들**:
1. **시도 1**: tsconfig.json에 `types` 필드 추가
   - 결과: 실패
   - 이유: @types/node 패키지가 설치되지 않음
2. **시도 2**: @types/node 설치 후 types 필드에 'node' 추가
   - 결과: 성공
   - 이유: Node.js 타입 정의가 프로젝트에 포함됨

**최종 해결 방법**:
- **방법**: `npm install --save-dev @types/node` 실행 후 tsconfig.json에 `"types": ["node", "jest"]` 추가
- **선택 이유**: Node.js 런타임 타입 정의 필요
- **참고 자료**: TypeScript 공식 문서

#### 상황 3: Jest React Native Preset 파싱 에러
`@react-native/jest-preset`의 Flow 타입 어노테이션으로 인한 Babel 파싱 에러

**시도한 방법들**:
1. **시도 1**: Babel 설정에 Flow 플러그인 추가
   - 결과: 실패
   - 이유: 복잡도 증가, 불필요한 의존성
2. **시도 2**: React Native preset 제거하고 기본 Jest 설정 사용
   - 결과: 성공
   - 이유: 현재 단계에서는 React Native 특화 기능 불필요

**최종 해결 방법**:
- **방법**: Jest 설정에서 `@react-native/jest-preset` 제거하고 기본 Babel 설정 사용
- **선택 이유**: 
  - 프로젝트 초기 단계에서는 순수 TypeScript 테스트만 필요
  - React Native 컴포넌트 테스트는 향후 추가 가능
  - 설정 단순화로 유지보수성 향상
- **참고 자료**: Jest 공식 문서

#### 상황 4: ESLint 9.x 설정 형식 변경
ESLint 9.x에서 `.eslintrc.js` 형식이 deprecated되고 `eslint.config.js` 형식으로 변경

**시도한 방법들**:
1. **시도 1**: 기존 `.eslintrc.js` 형식 사용
   - 결과: 실패
   - 이유: ESLint 9.x에서 더 이상 지원하지 않음
2. **시도 2**: 새로운 `eslint.config.js` 형식으로 마이그레이션
   - 결과: 성공
   - 이유: ESLint 9.x의 새로운 flat config 형식 사용

**최종 해결 방법**:
- **방법**: `eslint.config.js` 파일 생성 및 flat config 형식으로 설정
- **선택 이유**: ESLint 최신 버전 사용으로 향후 호환성 보장
- **참고 자료**: ESLint 마이그레이션 가이드

### ✅ 검증 (Verification)

- **TypeScript 컴파일**: ✅ 통과 (`npm run type-check`)
  - 모든 타입 정의 에러 없음
  - Strict mode 설정 확인
  - NodeJS.Timeout 타입 정상 인식

- **테스트 실행**: ✅ 통과 (`npm test`)
  - Jest 설정 정상 작동
  - fast-check property-based test 정상 실행 (100 iterations)
  - 2개 테스트 모두 통과

- **Linting**: ✅ 통과 (`npm run lint`)
  - ESLint 9.x flat config 정상 작동
  - TypeScript 규칙 적용 확인
  - no-console, no-explicit-any 규칙 활성화 확인

- **Formatting**: ✅ 통과 (`npm run format`)
  - Prettier 설정 정상 작동
  - 모든 소스 파일 포맷팅 완료

- **폴더 구조**: ✅ 확인
  ```
  /src
    /types        ✅ index.ts 생성됨
    /utils        ✅ .gitkeep 생성됨
    /components   ✅ .gitkeep 생성됨
    /hooks        ✅ .gitkeep 생성됨
    /context      ✅ .gitkeep 생성됨
    /screens      ✅ .gitkeep 생성됨
  ```

- **핵심 타입 정의**: ✅ 확인
  - SessionState, AppState, TurtleState 등 모든 인터페이스 정의 완료
  - no `any` 타입 사용 확인
  - 모든 타입이 strict null checks 통과

### 📝 학습 내용 (Learnings)

1. **React Native CLI의 변화**:
   - `react-native init`이 deprecated되어 `@react-native-community/cli` 사용 권장
   - 하지만 템플릿 시스템이 불안정하여 수동 설정이 더 안정적일 수 있음
   - 프로젝트 요구사항에 따라 수동 설정이 더 나은 선택일 수 있음

2. **TypeScript Strict Mode의 중요성**:
   - 초기 설정 시 strict mode를 활성화하면 향후 타입 관련 버그 대폭 감소
   - `NodeJS.Timeout` 같은 런타임 타입도 명시적으로 정의 필요
   - `types` 필드를 통해 필요한 타입 정의만 선택적으로 포함 가능

3. **Jest와 React Native의 통합**:
   - React Native preset이 Flow 타입을 사용하여 TypeScript 프로젝트에서 충돌 가능
   - 초기 단계에서는 기본 Jest 설정으로 충분
   - 컴포넌트 테스트가 필요할 때 React Native Testing Library 추가 고려

4. **ESLint 9.x의 변화**:
   - Flat config 형식이 새로운 표준
   - 기존 `.eslintrc.*` 형식은 deprecated
   - 마이그레이션이 필요하지만 설정이 더 명확해짐

5. **프로젝트 구조의 중요성**:
   - 초기에 명확한 폴더 구조를 설정하면 향후 확장이 용이
   - `/types`에 모든 타입을 중앙 관리하면 타입 일관성 유지 쉬움
   - `.gitkeep` 파일로 빈 디렉토리도 git에 추가 가능

### 🔗 관련 커밋
- 커밋 예정: `chore: 프로젝트 초기 설정 및 핵심 타입 정의`
- Branch: `main` (초기 설정)
- PR: N/A (초기 설정)

### 📊 생성된 파일 목록

**설정 파일**:
- `package.json` - 프로젝트 메타데이터 및 스크립트
- `tsconfig.json` - TypeScript 설정 (strict mode)
- `jest.config.js` - Jest 테스트 설정
- `jest.setup.js` - Jest 초기화 스크립트
- `babel.config.js` - Babel 트랜스파일러 설정
- `eslint.config.js` - ESLint 9.x flat config
- `.prettierrc.js` - Prettier 포맷팅 설정
- `.prettierignore` - Prettier 제외 파일

**소스 파일**:
- `src/types/index.ts` - 모든 핵심 TypeScript 인터페이스 (400+ 줄)
- `src/types/index.test.ts` - Jest 및 fast-check 검증 테스트
- `src/utils/.gitkeep` - utils 디렉토리 플레이스홀더
- `src/components/.gitkeep` - components 디렉토리 플레이스홀더
- `src/hooks/.gitkeep` - hooks 디렉토리 플레이스홀더
- `src/context/.gitkeep` - context 디렉토리 플레이스홀더
- `src/screens/.gitkeep` - screens 디렉토리 플레이스홀더

**문서**:
- `README.md` - 프로젝트 개요 및 사용 가이드
- `docs/implementation-journal.md` - 구현 일지 (이 문서)

**Mock 파일**:
- `__mocks__/fileMock.js` - Jest 이미지 파일 mock

### 🎯 다음 단계

Task 1 완료 후 다음 작업:
1. Task 2: 입력 검증 및 시간 포맷팅 유틸리티 구현
2. Task 3: 타이머 서비스 구현
3. Task 4: 진행률 계산 유틸리티 구현

---

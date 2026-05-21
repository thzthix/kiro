# 🐢 Turtle Study App

Focus together, one step at a time.

## Project Overview

거북이 스터디 앱은 사용자가 공부할 때 함께 걷는 거북이를 통해 시간 관리와 동기 부여를 제공하는 React Native 모바일 애플리케이션입니다.

## Project Structure

```
/src
  /types        # TypeScript interfaces and types
  /utils        # Business logic modules (pure functions)
  /components   # React components
  /hooks        # Custom React hooks
  /context      # React Context providers
  /screens      # Screen components
/assets         # Images and static assets
/__mocks__      # Jest mocks
```

## Technology Stack

- **Framework**: React Native
- **Language**: TypeScript (strict mode, no `any` types)
- **State Management**: React Context API + useReducer
- **Testing**: Jest + fast-check (property-based testing)
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v25.9.0 or higher)
- npm (v11.12.1 or higher)

### Installation

```bash
npm install
```

### Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

## Testing Strategy

This project uses a dual testing approach:

1. **Unit Tests**: Verify specific examples, edge cases, and component behavior
2. **Property-Based Tests**: Verify universal properties across all inputs using fast-check

All property-based tests run with a minimum of 100 iterations.

## Code Quality Standards

- **TypeScript**: All code is TypeScript with no `any` types
- **Function Length**: Maximum 50 lines per function (recommended)
- **No Console**: No console.log or debug prints in production code
- **No Hardcoded Paths**: Use environment variables or configuration files
- **Test Coverage**: Minimum 80% coverage for branches, functions, lines, and statements

## Git Workflow

### Branch Naming
- Feature branches: `feat/add-{feature-name}`
- Bug fixes: `fix/{bug-description}`
- Refactoring: `refactor/{component-name}`
- Chores: `chore/{task-description}`

### Commit Messages (한글)
All commit messages are written in Korean using Conventional Commits format:
- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `refactor:` - 코드 리팩토링
- `chore:` - 빌드, 설정 등
- `test:` - 테스트 추가/수정
- `docs:` - 문서 수정

## License

ISC

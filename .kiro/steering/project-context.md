---
inclusion: auto
description: Turtle Study App project overview, design philosophy, technical stack, and architectural decisions
---

# Turtle Study App - Project Context

## Project Overview
거북이 스터디 앱 (Turtle Study App)은 사용자가 공부할 때 거북이가 함께 걷는 느낌을 주는 타이머 앱입니다.

## Design Philosophy
- **장면형 UI**: 카드형 UI가 아닌, 거북이와 길 중심의 몰입형 장면
- **파스텔 워터컬러 스타일**: 부드럽고 따뜻한 느낌
- **미니멀한 인터랙션**: 당근/물 격려 아이템으로 간단한 상호작용

## Core Features
1. **타이머 입력**: 1-180분 범위의 공부 시간 설정
2. **거북이 애니메이션**: 시간에 따라 START에서 GOAL까지 이동
3. **격려 시스템**: 당근/물 아이템으로 거북이 격려 (3초간 기분 좋은 상태)
4. **일시정지/재개**: 일시정지 시 거북이가 길 위에서 자는 모습

## Turtle States (3 states only)
1. **걷는 중 (walking)**: 기본 상태, 다리 움직임 애니메이션
2. **기분 좋은 중 (happy)**: 격려 아이템 받은 후 3초간 유지
3. **자는 중 (sleeping)**: 일시정지 상태, 길 위에서 자는 모습

## Technical Stack
- **Framework**: React Native with TypeScript
- **State Management**: React Context API
- **Animation**: React Native Animated API with useNativeDriver
- **Testing**: Jest + React Native Testing Library + fast-check (PBT)

## Color Palette
- **Background**: Beige (#F5F1E8), Light Yellow (#FFF9E6)
- **Path**: Olive Green (#8B9556)
- **Progress Bar**: Mint (#A8D5BA) / Light Beige
- **Accents**: Soft pastels from design reference

## Key Design Decisions

### Timer Accuracy
- Calculate from start timestamp (not accumulating intervals)
- Cumulative accuracy within 1 second over entire session

### Animation Performance
- Turtle position updates: 200-300ms interval (battery efficiency)
- State transitions: 500ms smooth animations
- Touch feedback: within 100ms

### User Interaction
- Touch targets: minimum 44x44 points (accessibility)
- Debouncing: 500ms for buttons, 1 second for encouragement items
- Error messages: 3 second duration, dismissible on tap

### Turtle Animation
- Leg movement only (minimal vertical body motion)
- Smooth path following with curved trajectory
- Natural walking feel without excessive bounce

## Scope (MVP)
**Included:**
- Home screen (시간 입력)
- Study session screen (타이머, 거북이, 격려 아이템)
- Completion screen (완료 화면)

**Not Included (Future):**
- Statistics screen
- Settings screen
- Multiple turtle characters
- Sound effects
- Achievements/badges

## File Structure
```
/src
  /types
    - index.ts (AppState, SessionState, TimerState, TurtleState, etc.)
  /utils
    - InputValidator.ts
    - ProgressCalculator.ts
    - StateTransitionManager.ts
    - TimerService.ts
  /components
    - TimeInputPopup.tsx
    - TimerDisplay.tsx
    - ProgressBar.tsx
    - TurtleCharacter.tsx
    - PathComponent.tsx
    - EncouragementItems.tsx
    - SessionControls.tsx
    - BackgroundImage.tsx
    - DecorativeElements.tsx
    - StudyCanvas.tsx
  /hooks
    - useTimer.ts
    - useStudySession.ts
  /context
    - AppContext.tsx
  /screens
    - HomeScreen.tsx
    - StudySessionScreen.tsx
    - CompletionScreen.tsx
  - App.tsx
```

## Testing Strategy
- **Property-based tests**: 11 universal correctness properties
- **Unit tests**: Individual components and functions
- **Integration tests**: End-to-end flows
- **Manual testing**: Visual and interaction verification

## Known Limitations
- Turtle sprite is code-based SVG (not image-based yet)
- Path following is approximated (not true path animation)
- No sound effects in MVP
- No persistence (session data not saved)

## Future Enhancements
- Image-based turtle sprites with more expressions
- True path-following animation
- Statistics and history tracking
- Multiple turtle characters
- Sound effects and haptic feedback
- Dark mode support

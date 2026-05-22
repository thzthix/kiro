---
inclusion: auto
description: Design asset specifications, color palette, typography, and layout dimensions for Turtle Study App
---

# Design Assets Reference

## Asset Locations

### Background Image
- **Path**: Upload to `/assets/images/background.png`
- **Source**: Watercolor landscape with hills, lakes, trees, flowers
- **Colors**: Beige (#F5F1E8), Light Yellow (#FFF9E6), Olive Green (#8B9556)
- **Usage**: Full-screen background for all screens

### Turtle Character Images
- **Path**: `/assets/images/turtle/`
- **Files**:
  - `turtle_walking.jpeg` - 걷는 중 (기본 미소 표정)
  - `turtle_eating.jpeg` - 먹는 중 (당근/물 먹는 표정)
  - `turtle_happy.jpeg` - 기분 좋은 중 (입 벌리고 하트)
  - `turtle_sleeping.jpeg` - 자는 중 (눈 감고 자는 표정)
  - `turtle_arrived.png` - 도착함 (GOAL 도착 표정)
- **Format**: JPEG/PNG
- **Size**: Consistent dimensions across all states
- **Status**: ✅ All files uploaded

### Care Item Images (Immediate Placement)
- **Path**: `/assets/images/items/`
- **Files**:
  - `path-items.png` - 당근과 물 아이템 (거북이 앞에 나타나는 모습)
- **Style**: Watercolor-inspired, matches background aesthetic
- **Usage**: Fade-in animation (300ms) when button tapped, removed after 1 second when eating state ends
- **Status**: ✅ File uploaded
- **Note**: 이 이미지에서 당근과 물 부분을 각각 추출하여 사용. 버튼 탭 시 거북이 머리 바로 앞에 즉시 표시됨

### Care Moments Panel UI
- **Path**: `/assets/images/ui/`
- **Files**:
  - `care-moments-panel.png` - Care moments 패널 전체 UI (1.5M)
  - `panel-buttons.png` - 당근/물 버튼 아이콘들 (472K)
- **Style**: Watercolor-inspired panel with circular buttons
- **Size**: 44x44 points minimum (accessibility)
- **Status**: ✅ All files uploaded
- **Note**: panel-buttons.png에서 당근과 물 아이콘을 각각 추출하여 사용

### START/GOAL Markers
- **Path**: `/assets/images/markers/`
- **Files**:
  - `start-goal.png` - START 나무 표지판과 GOAL 하트 깃발
- **Usage**: 배경 이미지에도 포함되어 있지만, 별도 오버레이로 사용 가능
- **Status**: ✅ File uploaded

## UI Text Labels

### Care Moments Panel
- **Panel Title**: "care moments 돌봐주기" (displayed above buttons)
- **Buttons**: Icon-only (no text labels on buttons)

### Buttons
- **Start Session**: "시작하기"
- **Pause**: "일시정지"
- **Resume**: "재개"
- **Stop**: "중지"
- **New Session**: "새 세션 시작"
- **Close**: "닫기"

### Error Messages
- **Invalid Input**: "잘못 클릭하셨어요"
- **Timer Error**: "타이머를 시작할 수 없습니다"

## Color Palette (Extracted from Design)

```typescript
export const colors = {
  // Background
  background: {
    primary: '#F5F1E8',    // Beige
    secondary: '#FFF9E6',  // Light Yellow
  },
  
  // Path and Nature
  path: '#8B9556',         // Olive Green
  grass: '#A8C97F',        // Light Green
  
  // Progress and Interactive
  progress: '#A8D5BA',     // Mint
  progressBg: '#F5F1E8',   // Light Beige
  
  // Turtle
  turtleBody: '#F5E6D3',   // Cream
  turtleShell: '#A8D5BA',  // Mint Green
  
  // Items
  carrot: '#FFB366',       // Pastel Orange
  water: '#A8D5E6',        // Pastel Blue
  
  // Text
  text: {
    primary: '#4A4A4A',    // Dark Gray
    secondary: '#8B8B8B',  // Medium Gray
  },
  
  // UI Elements
  button: {
    primary: '#A8D5BA',    // Mint
    secondary: '#8B9556',  // Olive
    disabled: '#D9D9D9',   // Light Gray
  },
};
```

## Typography

```typescript
export const typography = {
  timer: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  
  button: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  
  error: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
  },
};
```

## Layout Dimensions

```typescript
export const layout = {
  // Screen padding
  screenPadding: 20,
  
  // Turtle size
  turtleWidth: 120,
  turtleHeight: 100,
  
  // Path
  pathHeight: 200,
  pathWidth: '90%',
  
  // Progress bar
  progressBarHeight: 8,
  progressBarWidth: '80%',
  
  // Touch targets
  minTouchTarget: 44,
  
  // Item icons
  itemSize: 60,
  itemSpacing: 20,
  
  // Buttons
  buttonHeight: 48,
  buttonMinWidth: 120,
  buttonBorderRadius: 24,
};
```

## Animation Timings

```typescript
export const animations = {
  // Turtle
  turtlePositionUpdate: 250,  // 200-300ms
  turtleStateTransition: 500,
  eatingStateDuration: 1000,  // 1 second
  happyStateDuration: 3000,   // 3 seconds
  
  // UI
  touchFeedback: 100,
  itemFeedback: 300,          // fade-in animation for care items
  errorMessageDuration: 3000,
  
  // State changes
  itemToEatingImmediate: 0,   // immediate transition when button tapped
  eatingToHappyDelay: 1000,   // after 1 second eating
  buttonActionDelay: 300,
  
  // Debouncing
  tapDebounce: 500,
  itemDebounce: 1000,
};
```

## Asset Preparation Checklist

- [x] Background image uploaded to `/assets/images/background.png` (1.5M)
- [x] Turtle walking image uploaded to `/assets/images/turtle/turtle_walking.jpeg` (11K)
- [x] Turtle eating image uploaded to `/assets/images/turtle/turtle_eating.jpeg` (36K)
- [x] Turtle happy image uploaded to `/assets/images/turtle/turtle_happy.jpeg` (12K)
- [x] Turtle sleeping image uploaded to `/assets/images/turtle/turtle_sleeping.jpeg` (9.6K)
- [x] Turtle arrived image uploaded to `/assets/images/turtle/turtle_arrived.png` (634K)
- [x] Path items image uploaded to `/assets/images/items/path-items.png` (359K)
- [x] Care moments panel UI uploaded to `/assets/images/ui/care-moments-panel.png` (1.5M)
- [x] Panel buttons uploaded to `/assets/images/ui/panel-buttons.png` (472K)
- [x] START/GOAL markers uploaded to `/assets/images/markers/start-goal.png` (36K)
- [ ] Extract individual item icons from path-items.png (당근, 물)
- [ ] Extract individual button icons from panel-buttons.png (당근 버튼, 물 버튼)
- [ ] Optimize images if needed (currently all < 2MB)

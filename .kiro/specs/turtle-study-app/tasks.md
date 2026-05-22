# Implementation Plan: Turtle Study App

## Overview

This implementation plan breaks down the turtle study app into discrete coding tasks. The app is built with React Native and TypeScript, using React Context for state management, custom hooks for timer logic, and the React Native Animated API for turtle animations.

**This implementation follows Test-Driven Development (TDD) methodology: write failing tests first (RED), implement code to pass tests (GREEN), then refactor while keeping tests green (REFACTOR).**

The implementation follows a bottom-up approach: core business logic first, then UI components, then integration and wiring. Each module follows the Red-Green-Refactor cycle.

## Tasks

- [x] 1. Set up project structure and core types
  - Create React Native project with TypeScript configuration
  - Define core TypeScript interfaces (AppState, SessionState with carrotCount/waterCount/eatingStateEndTime/happyStateEndTime/previousStateBeforePause/remainingEatingDuration/remainingHappyDuration, TimerState, UIState, PathCoordinates, Point, TurtleState including 'eating' and 'arrived', SessionStatus)
  - Set up testing framework (Jest + React Native Testing Library + fast-check)
  - Create directory structure: /src/types, /src/utils, /src/components, /src/hooks, /src/context, /src/screens
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 3.1, 4.1, 4.5, 4.7, 4.8, 5.2_

- [x] 2. Implement business logic modules (TDD: Red-Green-Refactor)
  
  - [x] 2.1 Write property tests for InputValidator (RED)
    - **Property 2: Non-Integer Input Rejected**
    - **Property 3: Out-of-Range Integer Rejected**
    - Write failing tests for non-integer input rejection
    - Write failing tests for out-of-range input rejection (< 1 or > 180)
    - Write failing tests for empty input rejection
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 1.5, 1.6**
  
  - [x] 2.2 Implement InputValidator module (GREEN)
    - Create validateTimeInput function with validation rules (non-empty, integer, 1-180 range)
    - Return ValidationResult with valid flag, value, and error type
    - Implement logic to make all property tests pass
    - Run tests - they should PASS
    - _Requirements: 1.5, 1.6, 1.7_
  
  - [x] 2.3 Refactor InputValidator (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract validation rules if needed
    - Run tests - they should still PASS
  
  - [x] 2.4 Write property tests for ProgressCalculator (RED)
    - **Property 4: Time Formatting Correctness**
    - **Property 6: Progress Calculation Formula**
    - Write failing tests for progress calculation: (elapsed / total) × 100, clamped to [0, 100]
    - Write failing tests for time formatting: MM:SS with zero-padding
    - Write failing tests for position calculation: map progress to path coordinates
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 2.1, 2.2, 3.3, 3.5, 3.6**
  
  - [x] 2.5 Implement ProgressCalculator module (GREEN)
    - Create calculateProgress function: (elapsed / total) × 100, clamped to [0, 100]
    - Create formatTime function: convert seconds to MM:SS with zero-padding
    - Create calculatePosition function: map progress percentage to path coordinates
    - Implement logic to make all property tests pass
    - Run tests - they should PASS
    - _Requirements: 2.1, 2.2, 3.3, 3.5, 3.6_
  
  - [x] 2.6 Refactor ProgressCalculator (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Optimize calculations if needed
    - Run tests - they should still PASS
  
  - [x] 2.7 Write property tests for StateTransitionManager (RED)
    - **Property 8: Care Item Triggers Eating Then Happy State**
    - **Property 9: Pause Preserves Turtle State**
    - **Property 11: Item Count Limits and Shake Animation**
    - Write failing tests for state transitions: Walking → Eating (1s with turtle_eating.jpeg) → Happy (3s with turtle_happy.jpeg) → Walking
    - Write failing tests for timer completion during eating/happy: immediately clear all async intervals → transition to arrived state (turtle_arrived.png static, NO bouncing)
    - Write failing tests for pause/resume: Walking/Eating/Happy → Sleeping → Walking/Eating/Happy with preserved remaining duration for eating/happy states
    - Write failing tests for item count initialization (3), decrement on tap, button disable at 0, and shake animation on depleted button tap
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 4.4, 4.5, 4.8, 4.9, 4.10, 5.2, 5.3, 5.6, 5.7, 5.8**
  
  - [x] 2.8 Implement StateTransitionManager module (GREEN)
    - Create getNextState function with turtle state transition logic
    - Create shouldTransitionFromEating function: check if 1 second elapsed since eating state start
    - Create shouldTransitionFromHappy function: check if 3 seconds elapsed since happy state start
    - Create shouldImmediatelyTransitionToArrived function: check if timer completed during eating/happy states
    - Create calculateRemainingStateDuration function: calculate remaining ms for eating/happy states when paused
    - Handle state transitions: Walking → Eating (item tap) → Happy (1s) → Walking (3s), Walking/Eating/Happy → Sleeping (pause), Sleeping → Walking/Eating/Happy (resume)
    - Handle edge case: Timer completion during eating/happy → immediately clear all async intervals → transition to arrived state
    - Handle edge case: Pause during eating/happy → store remainingEatingDuration or remainingHappyDuration for restoration on resume
    - Store previousStateBeforePause to restore state after resume
    - Implement logic to make all property tests pass
    - Run tests - they should PASS
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.7, 4.8, 4.9, 4.10, 5.10_
  
  - [x] 2.9 Refactor StateTransitionManager (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Simplify state transition logic if possible
    - Run tests - they should still PASS

- [x] 3. Implement TimerService (TDD: Red-Green-Refactor)
  
  - [x] 3.1 Write property tests for TimerService (RED)
    - **Property 5: Pause-Resume Time Preservation**
    - Write failing tests for pause-resume time preservation
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 2.6, 2.7**
  
  - [x] 3.2 Write unit tests for TimerService (RED)
    - Write failing test for timer initialization with valid duration
    - Write failing test for timer tick accuracy (within 1 second tolerance)
    - Write failing test for pause preserves remaining time
    - Write failing test for resume continues from paused time
    - Write failing test for stop clears interval
    - Write failing test for completion callback triggers at 00:00
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 3.3 Implement TimerService (GREEN)
    - Create TimerService with start, pause, resume, stop, getRemainingTime methods
    - Use setInterval with 1000ms interval
    - Calculate remaining time from start timestamp to avoid drift
    - Store TimerState with intervalId, startTimestamp, pausedTimestamp, totalDuration, remainingAtPause
    - Trigger onTick callback every second with remaining time
    - Trigger onComplete callback when remaining time reaches 0
    - Clear intervals on pause/stop
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 3.4 Refactor TimerService (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract timer calculation logic if needed
    - Run tests - they should still PASS

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement state management (TDD: Red-Green-Refactor)
  
  - [x] 5.1 Write property tests for state reducer (RED)
    - **Property 1: Valid Duration Initializes Session**
    - **Property 7: Pause-Resume Position Preservation**
    - **Property 9: Pause Preserves Turtle State**
    - Write failing tests for session initialization with valid duration
    - Write failing tests for pause-resume position preservation
    - Write failing tests for pause preserves turtle state (walking/eating/happy → sleeping)
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 1.4, 3.7, 3.8, 4.8, 4.9**
  
  - [x] 5.2 Write unit tests for state reducer (RED)
    - Write failing test for START_SESSION action initializes session with carrotCount=3, waterCount=3
    - Write failing test for PAUSE_SESSION action freezes timer and changes turtle to sleeping
    - Write failing test for RESUME_SESSION action continues from paused state and restores previous turtle state
    - Write failing test for STOP_SESSION action clears session
    - Write failing test for TICK action decrements remaining time
    - Write failing test for UPDATE_TURTLE_STATE action changes turtle state (eating, happy, arrived)
    - Write failing test for PROVIDE_ITEM action triggers eating state and decrements item count
    - Write failing test for COMPLETE_SESSION action marks session as completed
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 1.4, 2.6, 2.7, 4.5, 4.7, 4.9, 5.2, 5.7, 5.8, 9.2, 9.3, 9.5_
  
  - [x] 5.3 Create AppContext with AppState and reducer (GREEN)
    - Define AppState interface (screen, session, error)
    - Define SessionState interface (totalDuration, remainingTime, status, turtleState, eatingStateEndTime, happyStateEndTime, previousStateBeforePause, remainingEatingDuration, remainingHappyDuration, carrotCount, waterCount, timestamps)
    - Create reducer with actions: START_SESSION, PAUSE_SESSION, RESUME_SESSION, STOP_SESSION, TICK, UPDATE_TURTLE_STATE, PROVIDE_ITEM, COMPLETE_SESSION
    - Implement reducer logic for each action type to make all tests pass
    - Initialize carrotCount and waterCount to 3 on START_SESSION
    - Decrement item counts on PROVIDE_ITEM action
    - Store remainingEatingDuration and remainingHappyDuration on PAUSE_SESSION when in eating/happy states
    - Restore eating/happy state with remaining duration on RESUME_SESSION
    - Create AppProvider component wrapping children with context
    - Run tests - they should PASS
    - _Requirements: 1.4, 2.1, 2.6, 2.7, 4.5, 4.7, 4.9, 4.10, 5.2, 5.7, 5.8, 5.10, 9.2, 9.3, 9.5_
  
  - [x] 5.4 Refactor state management (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Simplify reducer logic if possible
    - Extract action creators if needed
    - Run tests - they should still PASS

- [x] 6. Implement custom hooks (TDD: Red-Green-Refactor)
  
  - [x] 6.1 Write unit tests for useTimer hook (RED)
    - Write failing test for useTimer hook lifecycle (start, pause, resume, stop)
    - Write failing test for timer callbacks (onTick, onComplete)
    - Write failing test for cleanup on unmount
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [x] 6.2 Create useTimer hook (GREEN)
    - Accept totalDuration, onTick, onComplete callbacks
    - Use TimerService internally
    - Return start, pause, resume, stop, remainingTime
    - Clean up intervals on unmount
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [x] 6.3 Refactor useTimer hook (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Optimize hook dependencies if needed
    - Run tests - they should still PASS
  
  - [x] 6.4 Write unit tests for useStudySession hook (RED)
    - Write failing test for useStudySession hook state transitions
    - Write failing test for integration between useTimer and useStudySession
    - Write failing test for session lifecycle (start, pause, resume, stop)
    - Write failing test for turtle state transitions based on timer ticks
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 9.2, 9.5_
  
  - [x] 6.5 Create useStudySession hook (GREEN)
    - Use AppContext to access session state and dispatch
    - Return session state, startSession, pauseSession, resumeSession, stopSession, provideItem functions
    - Integrate useTimer hook for timer management
    - Handle turtle state transitions: eating (1s with turtle_eating.jpeg) → happy (3s with turtle_happy.jpeg) → walking
    - Handle edge case: Timer completion during eating/happy → immediately clear all async intervals → transition to arrived state (turtle_arrived.png static, NO bouncing)
    - Handle edge case: Pause during eating/happy → preserve remainingEatingDuration or remainingHappyDuration for restoration on resume
    - Handle item count management and button disable logic
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 1.4, 2.6, 2.7, 4.4, 4.5, 4.8, 4.10, 5.2, 5.7, 5.8, 5.10, 9.2, 9.5_
  
  - [x] 6.6 Refactor useStudySession hook (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Simplify state transition logic if possible
    - Run tests - they should still PASS

- [x] 7. Implement UI components - Input and validation (TDD: Red-Green-Refactor)
  
  - [x] 7.1 Write unit tests for TimeInputPopup (RED)
    - Write failing test for popup displays when visible is true
    - Write failing test for error message for empty input
    - Write failing test for error message for non-integer input
    - Write failing test for error message for out-of-range input
    - Write failing test for onSubmit called with valid duration
    - Write failing test for onCancel closes popup without starting session
    - Write failing test for error clears when input changes
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  
  - [x] 7.2 Create TimeInputPopup component (GREEN)
    - Accept visible, onSubmit, onCancel props
    - Render modal with text input for duration
    - Implement input validation using InputValidator
    - Display error messages for invalid input (empty, non-integer, out-of-range)
    - Show submit and cancel buttons
    - Clear error message when user modifies input
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  
  - [x] 7.3 Refactor TimeInputPopup (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract validation logic if needed
    - Run tests - they should still PASS

- [ ] 8. Implement UI components - Timer and display (TDD: Red-Green-Refactor)
  
  - [x] 8.1 Write unit tests for SessionHeader and display components (RED)
    - Write failing test for SessionHeader renders beige round panel container
    - Write failing test for SessionHeader displays centered timer in MM:SS format
    - Write failing test for SessionHeader displays progress bar below timer
    - Write failing test for SessionHeader progress bar shows mini turtle icon slider that moves rightward
    - Write failing test for TimerDisplay formats time correctly
    - Write failing test for ProgressBar renders correct fill percentage
    - Write failing test for ProgressBar at 0%, 50%, 100%
    - Write failing test for ProgressBar mini turtle icon position based on progress
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 3.5_
  
  - [x] 8.2 Create SessionHeader component (GREEN)
    - Accept remainingSeconds and progress props
    - Render beige-colored round panel container at top of screen
    - Display TimerDisplay component centered horizontally
    - Display ProgressBar component directly below timer
    - Apply consistent styling with beige background
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [x] 8.3 Create TimerDisplay component (GREEN)
    - Accept remainingSeconds prop
    - Format seconds to MM:SS using formatTime from ProgressCalculator
    - Render formatted time with large, bold typography
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.2, 2.1, 2.2_
  
  - [x] 8.4 Create ProgressBar component (GREEN)
    - Accept progress prop (0-100)
    - Render horizontal bar with filled portion based on progress
    - Display mini turtle icon on slider head that moves rightward as progress increases
    - Use mint color for filled portion, light beige for unfilled
    - Position mini turtle icon at progress percentage along bar
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 3.5_
  
  - [x] 8.5 Refactor display components (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract styling if needed
    - Run tests - they should still PASS

- [ ] 9. Implement UI components - Turtle and animation (TDD: Red-Green-Refactor)
  
  - [x] 9.1 Write unit tests for turtle components (RED)
    - Write failing test for TurtleCharacter renders correct sprite for each state (walking, eating with turtle_eating.jpeg, happy with turtle_happy.jpeg, sleeping, arrived with turtle_arrived.png)
    - Write failing test for TurtleCharacter always faces rightward (toward GOAL direction)
    - Write failing test for TurtleCharacter position updates based on progress
    - Write failing test for TurtleCharacter eating state displays turtle_eating.jpeg with head nodding + mouth movement animation (1s)
    - Write failing test for TurtleCharacter happy state displays turtle_happy.jpeg with heart effect above head (3s)
    - Write failing test for TurtleCharacter arrived state displays turtle_arrived.png static next to GOAL flag (NO bouncing animation)
    - Write failing test for PathComponent renders path with correct coordinates
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.7, 4.8, 5.5, 5.6, 5.9_
  
  - [x] 9.2 Create TurtleCharacter component (GREEN)
    - Accept progress, state, pathCoordinates props
    - Render turtle sprite based on state (walking, eating, happy, sleeping, arrived)
    - Always render turtle facing rightward (toward GOAL direction)
    - Display turtle_eating.jpeg with head nodding + mouth movement animation for eating state (1s duration)
    - Display turtle_happy.jpeg with heart effect above head for happy state (3s duration)
    - Display turtle_arrived.png static next to GOAL flag for arrived state (NO bouncing animation)
    - Calculate turtle position using calculatePosition from ProgressCalculator
    - Animate turtle position along path using React Native Animated API
    - Update position every 200-300ms for battery efficiency
    - Smooth state transitions within 500ms
    - Use useNativeDriver for transform animations
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 3.8, 4.1, 4.2, 4.7, 4.8, 4.10, 5.5, 5.6, 5.9_
  
  - [x] 9.3 Create PathComponent (GREEN)
    - Accept pathCoordinates prop
    - Render curved path from START to GOAL using SVG or Canvas
    - Display START and GOAL labels
    - Use olive green color for path
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 3.1, 3.4_
  
  - [x] 9.4 Refactor turtle components (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Optimize animation performance if needed
    - Run tests - they should still PASS

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement UI components - Interaction (TDD: Red-Green-Refactor)
  
  - [x] 11.1 Write property test for CareItemsPanel (RED)
    - **Property 10: Rapid Tap Debouncing**
    - **Property 11: Item Count Limits and Shake Animation**
    - Write failing tests for rapid tap debouncing (1 second cooldown)
    - Write failing tests for item count initialization (3), decrement, button disable at 0, and shake animation on depleted button tap
    - Run tests - they should FAIL (no implementation yet)
    - **Validates: Requirements 5.2, 5.3, 5.6, 5.7, 5.13, 5.16**
  
  - [x] 11.2 Write unit tests for CareItemsPanel (RED)
    - Write failing test for "돌봐주기" title text displays above button icons
    - Write failing test for carrot and water icons render horizontally aligned with count display (🥕 ×3, 💧 ×3)
    - Write failing test for tap triggers onItemTap callback and decrements count
    - Write failing test for visual feedback animation plays
    - Write failing test for disabled prop prevents taps during eating/happy states
    - Write failing test for button disabled when count reaches 0
    - Write failing test for shake animation plays on depleted button (×0) tap
    - Write failing test for debouncing ignores rapid taps (1 second cooldown)
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.13, 5.15, 5.16_
  
  - [x] 11.3 Create CareItemsPanel component (GREEN)
    - Accept onItemTap, disabled, carrotCount, waterCount, turtleState props
    - Render "돌봐주기" title text above button icons
    - Render carrot and water icons horizontally aligned with remaining count display (🥕 ×{carrotCount}, 💧 ×{waterCount})
    - Position panel at bottom left of screen
    - Render buttons with touch targets (minimum 44x44 points)
    - Handle tap events with debouncing (1 second cooldown)
    - Show visual feedback animation (300-1000ms) on tap
    - Play shake animation (300ms) on depleted button (×0) tap
    - Disable buttons when session is paused (disabled prop)
    - Disable buttons during eating/happy states (disabled prop)
    - Disable individual button when corresponding count reaches 0
    - Ignore rapid taps within 1 second
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.13, 5.14, 5.15, 5.16_
  
  - [x] 11.4 Refactor CareItemsPanel (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract debouncing logic if needed
    - Run tests - they should still PASS
  
  - [x] 11.5 Write unit tests for SessionControls (RED)
    - Write failing test for pause button (⏸️) shows as round square button when running
    - Write failing test for resume button shows as round square button when paused
    - Write failing test for stop button (⏹️) shows as round square button always
    - Write failing test for buttons positioned at bottom right of screen
    - Write failing test for onPause called when pause tapped
    - Write failing test for onResume called when resume tapped
    - Write failing test for confirmation dialog shows when stop tapped
    - Write failing test for onStop called when stop confirmed
    - Write failing test for dialog dismissed when stop cancelled
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [x] 11.6 Create SessionControls component (GREEN)
    - Accept status, onPause, onResume, onStop props
    - Position controls at bottom right of screen
    - Render pause button (⏸️) as round square button when status is 'running'
    - Render resume button as round square button when status is 'paused'
    - Render stop button (⏹️) as round square button always
    - Handle button taps with visual feedback (< 100ms)
    - Show confirmation dialog for stop action
    - Touch targets minimum 44x44 points
    - Implement logic to make all tests pass
    - Run tests - they should PASS
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [x] 11.7 Refactor SessionControls (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract dialog logic if needed
    - Run tests - they should still PASS

- [x] 12. Implement UI components - Background and theme (TDD: Red-Green-Refactor)
  
  - [x] 12.1 Write unit tests for background components (RED)
    - Write failing test for BackgroundImage renders watercolor-style background
    - Write failing test for BackgroundImage fallback on load failure
    - Write failing test for DecorativeElements renders at least 3 elements
    - Write failing test for StudyCanvas composes all child components with watercolor background
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_
  
  - [x] 12.2 Create BackgroundImage component (GREEN)
    - Render watercolor-style landscape background with hills, lakes, trees, flowers
    - Use beige and light yellow colors from palette
    - Fallback to solid beige color if image fails to load
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  
  - [x] 12.3 Create DecorativeElements component (GREEN)
    - Render at least 3 decorative elements (wooden signs, plants, stones, bushes, trees, flags)
    - Position elements using PathCoordinates
    - Use colors from defined palette
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [x] 12.4 Create StudyCanvas component (GREEN)
    - Compose BackgroundImage (watercolor style), PathComponent, TurtleCharacter, DecorativeElements
    - Apply consistent color palette across all child components
    - Handle touch events: completely ignore non-interactive area touches (no error message, no visual response)
    - Pass carrotCount and waterCount to CareItemsPanel
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 5.2, 5.3, 6.1, 6.2, 6.5, 6.7, 8.1_
  
  - [x] 12.5 Refactor background components (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract color palette constants if needed
    - Run tests - they should still PASS

- [x] 13. Implement screens (TDD: Red-Green-Refactor)
  
  - [x] 13.1 Write unit tests for screens (RED)
    - Write failing test for HomeScreen renders and opens TimeInputPopup
    - Write failing test for StudySessionScreen renders SessionHeader at top with beige round panel
    - Write failing test for StudySessionScreen renders StudyCanvas with watercolor background
    - Write failing test for StudySessionScreen renders CareItemsPanel at bottom left with "돌봐주기" title
    - Write failing test for StudySessionScreen renders SessionControls at bottom right with round square buttons
    - Write failing test for StudySessionScreen handles pause/resume/stop
    - Write failing test for StudySessionScreen handles care item interactions with count management
    - Write failing test for StudySessionScreen ignores non-interactive area touches (no error message)
    - Write failing test for CompletionScreen renders with session summary and turtle in arrived state (turtle_arrived.png static, NO bouncing)
    - Write failing test for CompletionScreen buttons navigate correctly
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 4.7, 5.1, 5.2, 5.3, 5.9, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 9.1, 9.2, 9.5_
  
  - [x] 13.2 Create HomeScreen (GREEN)
    - Display app title and description
    - Show button to open TimeInputPopup
    - Use consistent color palette and visual theme
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.1, 6.1, 6.2, 6.5_
  
  - [x] 13.3 Create StudySessionScreen (GREEN)
    - Compose SessionHeader at top (beige round panel with centered timer + progress bar with mini turtle slider)
    - Compose StudyCanvas in center (watercolor background with turtle always facing rightward)
    - Compose CareItemsPanel at bottom left ("돌봐주기" title + carrot/water buttons with counts)
    - Compose SessionControls at bottom right (⏸️⏹️ round square buttons)
    - Use useStudySession hook for state management
    - Handle pause, resume, stop actions
    - Handle care item interactions with count management (carrotCount, waterCount)
    - Trigger completion when timer reaches 0
    - Handle edge case: Timer completion during eating/happy → immediately clear intervals → transition to arrived state
    - Completely ignore non-interactive area touches (no error message, no visual response)
    - Pass carrotCount and waterCount to CareItemsPanel
    - Disable CareItemsPanel during eating/happy states
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.10, 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 5.8, 5.10, 8.1, 9.1, 9.2, 9.4, 9.5, 9.10_
  
  - [x] 13.4 Create CompletionScreen (GREEN)
    - Display turtle at GOAL in "arrived" state using turtle_arrived.png static next to GOAL flag (NO bouncing animation)
    - Show total study duration in MM:SS format
    - Provide button to start new session (opens TimeInputPopup)
    - Provide close button to return to home screen
    - Display within 500ms of timer reaching 00:00
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 4.7, 5.9, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 13.5 Refactor screens (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract common layout patterns if needed
    - Run tests - they should still PASS

- [x] 14. Implement touch interaction and responsiveness (TDD: Red-Green-Refactor)
  
  - [x] 14.1 Write unit tests for touch interaction (RED)
    - Write failing test for visual feedback appears within 100ms
    - Write failing test for state change timing for items and buttons
    - Write failing test for tap debouncing ignores rapid taps
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 14.2 Add touch feedback to all interactive elements (GREEN)
    - Implement visual change within 100ms for all buttons and care item buttons
    - Use opacity change, scale animation, or highlight effect
    - Apply to TimeInputPopup buttons, SessionControls buttons, CareItemsPanel buttons
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 10.1_
  
  - [x] 14.3 Implement state change timing (GREEN)
    - Ensure care item button tap initiates turtle eating state change within 200ms
    - Ensure button tap initiates state change within 300ms
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 10.2, 10.3_
  
  - [x] 14.4 Implement tap debouncing (GREEN)
    - Ignore subsequent taps on same element within 500ms (buttons) or 1 second (care items)
    - Provide no visual feedback for ignored taps
    - Execute no action for ignored taps
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 10.4, 5.13_
  
  - [x] 14.5 Refactor touch interaction (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract touch feedback utilities if needed
    - Run tests - they should still PASS

- [ ] 15. Implement error handling (TDD: Red-Green-Refactor)
  
  - [x] 15.1 Write unit tests for error handling (RED)
    - Write failing test for timer error shows message and returns to home
    - Write failing test for animation fallbacks work correctly
    - Write failing test for state transition validation
    - Write failing test for non-interactive area touches are completely ignored (no error message, no visual response)
    - Write failing test for error doesn't modify session state
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 2.5, 6.6, 8.1, 8.4, 9.1_
  
  - [x] 15.2 Add error handling for timer failures (GREEN)
    - Catch timer initialization errors, show "타이머를 시작할 수 없습니다" message, return to home
    - Recalculate from start time if timer becomes out of sync
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 2.5, 8.4_
  
  - [-] 15.3 Add error handling for animation failures (GREEN)
    - Show static turtle image if animation fails to load
    - Use solid beige background if background image fails to load
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 6.6_
  
  - [x] 15.4 Add error handling for state transitions (GREEN)
    - Log error and maintain current state if invalid transition attempted
    - Validate all state transitions before execution
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 4.9, 8.4_
  
  - [-] 15.5 Add error handling for touch interactions (GREEN)
    - Completely ignore non-interactive area touches (no error message, no visual response, no state modification)
    - Preserve timer, turtle position, and session status during ignored touches
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 8.1, 9.1_
  
  - [ ] 15.6 Refactor error handling (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract error handling utilities if needed
    - Run tests - they should still PASS

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Integration and wiring (TDD: Red-Green-Refactor)
  
  - [ ] 17.1 Write integration tests (RED)
    - Write failing test for complete session flow from start to completion with arrived state (turtle_arrived.png static, NO bouncing)
    - Write failing test for pause/resume flow with timer and turtle state (walking/eating/happy → sleeping → restored with preserved duration)
    - Write failing test for care item flow with eating (1s with turtle_eating.jpeg) → happy (3s with turtle_happy.jpeg) state transitions and count management
    - Write failing test for timer completion during eating/happy state → immediately clear intervals → transition to arrived state
    - Write failing test for pause during eating/happy state → preserve remaining duration → restore on resume
    - Write failing test for stop flow with confirmation dialog
    - Write failing test for non-interactive area touches completely ignored (no error message)
    - Write failing test for depleted item button (×0) tap triggers shake animation
    - Run tests - they should FAIL (no implementation yet)
    - _Requirements: 1.4, 2.4, 4.4, 4.5, 4.7, 4.8, 4.10, 5.2, 5.7, 5.8, 5.10, 7.1, 8.1, 9.1, 9.2, 9.5, 9.8_
  
  - [ ] 17.2 Wire App root with navigation and context (GREEN)
    - Create App component with AppProvider
    - Set up navigation between HomeScreen, StudySessionScreen, CompletionScreen
    - Pass state and callbacks through context
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 1.1, 6.5, 7.1_
  
  - [ ] 17.3 Integrate timer with turtle state transitions (GREEN)
    - Connect timer ticks to turtle state updates
    - Trigger happy state after 1 second of eating state (display turtle_happy.jpeg with heart effect)
    - Trigger walking state after 3 seconds of happy state
    - Handle edge case: Timer completion during eating/happy → immediately clear all async intervals → transition to arrived state (turtle_arrived.png static, NO bouncing)
    - Pause eating and happy timers when session paused, preserve remaining duration
    - Resume eating and happy timers when session resumed, restore from remaining duration
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 2.3, 4.4, 4.5, 4.8, 4.9, 4.10, 5.5, 5.6, 5.10, 9.3, 9.8_
  
  - [ ] 17.4 Integrate care items with turtle state (GREEN)
    - Connect care item button taps to turtle eating state changes
    - Trigger eating state immediately when care item button tapped (display turtle_eating.jpeg with head nodding + mouth movement for 1s)
    - Decrement item count on tap
    - Disable buttons during eating (1s) + happy (3s) states
    - Disable buttons when count reaches 0
    - Play shake animation (300ms) on depleted button (×0) tap
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 4.4, 4.5, 5.2, 5.4, 5.5, 5.6, 5.7, 5.8, 5.13, 9.10_
  
  - [ ] 17.5 Integrate pause/resume with all timers (GREEN)
    - Pause timer, eating timer, and happy timer on pause action
    - Store remainingEatingDuration or remainingHappyDuration when pausing during eating/happy states
    - Resume all timers from paused state on resume action
    - Restore eating/happy state with remaining duration on resume
    - Change turtle to sleeping state during pause
    - Restore previous turtle state (walking, eating, or happy) on resume
    - Implement logic to make tests pass
    - Run tests - they should PASS
    - _Requirements: 4.8, 4.9, 4.10, 5.10, 9.2, 9.3, 9.5, 9.10_
  
  - [ ] 17.6 Refactor integration code (REFACTOR)
    - Clean up code while keeping tests green
    - Ensure no duplication, clear naming
    - Extract integration utilities if needed
    - Run tests - they should still PASS

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- **TDD Methodology**: All tasks follow the Red-Green-Refactor cycle
  - **RED**: Write failing tests first
  - **GREEN**: Implement code to make tests pass
  - **REFACTOR**: Clean up code while keeping tests green
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (11 properties total)
- Unit tests validate specific examples, edge cases, and component behavior
- Integration tests validate end-to-end flows and component interactions
- All tests are REQUIRED (no optional test tasks)
- All code uses TypeScript as specified in the design document
- React Native Animated API with useNativeDriver is used for performance
- Timer accuracy is maintained by calculating from start timestamp rather than accumulating intervals
- All touch targets meet minimum 44x44 point accessibility requirement

**UI Layout:**
- **SessionHeader**: Beige round panel at top with centered timer (MM:SS) + progress bar with mini turtle icon slider moving rightward
- **StudyCanvas**: Watercolor background with turtle always facing rightward (toward GOAL)
- **Interaction Area**: Split into left (CareItemsPanel) and right (SessionControls)
- **CareItemsPanel**: Bottom left with "돌봐주기" title above horizontally aligned carrot/water buttons with counts (🥕 ×3, 💧 ×3)
- **SessionControls**: Bottom right with ⏸️ pause and ⏹️ stop round square buttons

**Turtle States and Animations:**
- **walking**: Default state, turtle always faces rightward, animated leg movement
- **eating**: turtle_eating.jpeg with head nodding + mouth movement animation (1s duration)
- **happy**: turtle_happy.jpeg with heart effect above head (3s duration)
- **sleeping**: During pause
- **arrived**: turtle_arrived.png static next to GOAL flag (NO bouncing animation)

**Care Item Mechanism:**
- Immediate eating state trigger when button tapped (no path placement/walking needed)
- Item count limits: Carrot 3개, Water 3개 per session (initialized to 3, decremented on tap, button disabled at 0)
- Button disable logic: CareItemsPanel buttons disabled during eating (1s) + happy (3s) states AND when count = 0
- Shake animation (300ms) plays on depleted button (×0) tap
- Display remaining counts (🥕 ×{count}, 💧 ×{count}) next to care item buttons

**State Transitions:**
- Walking → Eating (1s with turtle_eating.jpeg) → Happy (3s with turtle_happy.jpeg) → Walking
- Walking/Eating/Happy → Sleeping (pause) → Walking/Eating/Happy (resume with preserved duration)

**Edge Cases:**
- **Timer completion during eating/happy**: Immediately clear all async intervals → transition to arrived state (turtle_arrived.png static, NO bouncing)
- **Pause during eating/happy**: Store remainingEatingDuration or remainingHappyDuration → restore on resume

**Error Handling:**
- **Non-interactive area touches**: Completely ignored (no error message, no visual response, no state modification)
- **Depleted item button taps**: Shake animation only (no error message)

**Performance:**
- Turtle position updates every 200-300ms for battery efficiency while maintaining fluid movement

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.4", "2.7"] },
    { "id": 2, "tasks": ["2.2", "2.5", "2.8"] },
    { "id": 3, "tasks": ["2.3", "2.6", "2.9", "3.1", "3.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "5.1", "5.2"] },
    { "id": 5, "tasks": ["5.3", "5.4", "6.1"] },
    { "id": 6, "tasks": ["6.2", "6.3", "6.4"] },
    { "id": 7, "tasks": ["6.5", "6.6", "7.1", "8.1"] },
    { "id": 8, "tasks": ["7.2", "7.3", "8.2", "8.3", "8.4", "8.5", "9.1"] },
    { "id": 9, "tasks": ["9.2", "9.3", "9.4", "11.1", "11.2"] },
    { "id": 10, "tasks": ["11.3", "11.4", "11.5", "12.1"] },
    { "id": 11, "tasks": ["11.6", "11.7", "12.2", "12.3", "12.4"] },
    { "id": 12, "tasks": ["12.5", "13.1"] },
    { "id": 13, "tasks": ["13.2", "13.3", "13.4"] },
    { "id": 14, "tasks": ["13.5", "14.1"] },
    { "id": 15, "tasks": ["14.2", "14.3", "14.4", "14.5", "15.1"] },
    { "id": 16, "tasks": ["15.2", "15.3", "15.4", "15.5"] },
    { "id": 17, "tasks": ["15.6", "17.1"] },
    { "id": 18, "tasks": ["17.2", "17.3", "17.4", "17.5"] },
    { "id": 19, "tasks": ["17.6"] }
  ]
}
```

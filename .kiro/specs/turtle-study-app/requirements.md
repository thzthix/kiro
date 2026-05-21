# Requirements Document

## Introduction

거북이 스터디 앱은 사용자가 공부할 때 함께 걷는 거북이를 통해 시간 관리와 동기 부여를 제공하는 모바일 애플리케이션입니다. 사용자가 설정한 시간 동안 거북이가 천천히 길을 걸어가며, 중간에 당근이나 물을 주면서 격려할 수 있습니다. 따뜻한 파스텔 톤과 수채화 느낌의 디자인으로 평화롭고 집중할 수 있는 분위기를 제공합니다.

## Glossary

- **Study_App**: 거북이 스터디 애플리케이션 시스템
- **User**: 앱을 사용하는 사용자
- **Turtle**: 화면에서 길을 걷는 거북이 캐릭터
- **Study_Session**: 사용자가 시작한 공부 세션
- **Timer**: 공부 시간을 측정하고 표시하는 타이머
- **Path**: 거북이가 START 지점에서 GOAL 지점까지 이동하는 길
- **Care_Item**: 당근이나 물과 같이 거북이를 즉시 돌보는 아이템
- **Progress_Bar**: 0%에서 100%까지 진행 상황을 표시하는 바
- **Turtle_State**: 거북이의 상태 (걷는 중, 먹는 중, 기분 좋은 중, 자는 중, 도착함)
- **Time_Input_Popup**: 사용자가 공부 시간을 입력하거나 선택하는 팝업
- **Care_Moments_Panel**: 당근과 물 버튼이 있는 "care moments 돌봐주기" 패널 (화면 하단 고정)

## Requirements

### Requirement 1: SessionHeader 레이아웃

**User Story:** As a User, I want to see a clear header with timer and progress information, so that I can track my study session at a glance.

#### Acceptance Criteria

1. WHILE a Study_Session is active, THE Study_App SHALL display a SessionHeader at the top of the screen as a beige-colored round panel
2. THE SessionHeader SHALL display a large timer in MM:SS format centered horizontally
3. THE SessionHeader SHALL display a Progress_Bar directly below the timer
4. THE Progress_Bar SHALL display progress from 0% to 100% with a slider head
5. THE Progress_Bar slider head SHALL display a mini turtle icon that moves rightward as progress increases

### Requirement 2: 홈 화면 및 공부 시간 설정

**User Story:** As a User, I want to see a welcoming home screen and easily set my study time, so that I can quickly start my study session.

#### Acceptance Criteria

1. WHEN the User opens the Study_App for the first time or returns to the home screen, THE Study_App SHALL display a home screen with the following elements:
   - App title "🐢 Turtle Study" at the top center
   - Subtitle "Focus together, one step at a time." below the title
   - A smiling turtle illustration in the center
   - Watercolor background matching the app's visual theme
2. WHEN the home screen loads, THE Study_App SHALL automatically display the Time_Input_Popup overlaying the home screen
3. THE Time_Input_Popup SHALL display the title "얼마나 집중하시겠어요?" (How long would you like to focus?)
4. THE Time_Input_Popup SHALL provide an input field for duration with "분" (minutes) label
5. THE Time_Input_Popup SHALL allow the User to input or select a study duration as an integer between 1 minute and 180 minutes
6. THE Time_Input_Popup SHALL provide a "시작하기" (Start) button for the User to confirm the time input
7. WHEN the User taps the "시작하기" button with a valid integer duration between 1 and 180 minutes, THE Study_App SHALL start the Study_Session with the specified duration
8. WHEN the User provides a non-integer value in the time input, THE Study_App SHALL display an error message and keep the Time_Input_Popup open
9. WHEN the User provides an integer value less than 1 or greater than 180 minutes, THE Study_App SHALL display an error message and keep the Time_Input_Popup open
10. WHEN the User provides an empty time input and taps the "시작하기" button, THE Study_App SHALL display an error message and keep the Time_Input_Popup open
11. THE Time_Input_Popup SHALL provide a cancel or close button that dismisses the popup and returns to the home screen without starting a Study_Session
12. WHEN the User taps the cancel button, THE Study_App SHALL dismiss the Time_Input_Popup and show the home screen with the turtle illustration and app title

### Requirement 3: 타이머 표시 및 진행

**User Story:** As a User, I want to see a timer counting down my study time, so that I know how much time remains in my study session.

#### Acceptance Criteria

1. WHEN a Study_Session starts, THE Timer SHALL initialize to display the total study duration in MM:SS format
2. WHILE a Study_Session is running (not paused), THE Timer SHALL display the remaining time in MM:SS format
3. WHILE a Study_Session is running (not paused), THE Timer SHALL decrement by one second every second
4. WHEN the Timer reaches 00:00, THE Study_App SHALL stop the Timer and mark the Study_Session as completed
5. THE Timer SHALL display time with cumulative accuracy, ensuring the total variance does not exceed a 1-second tolerance over the entire session duration
6. WHEN a Study_Session is paused, THE Timer SHALL freeze at the current remaining time without decrementing
7. WHEN a paused Study_Session is resumed, THE Timer SHALL continue decrementing from the frozen remaining time

### Requirement 4: 거북이 이동 및 진행률

**User Story:** As a User, I want to see the turtle walking along the path as time progresses, so that I can visualize my study progress.

#### Acceptance Criteria

1. WHEN a Study_Session starts, THE Turtle SHALL be positioned at the START point of the Path (0% progress)
2. WHILE a Study_Session is running (not paused), THE Turtle SHALL update its position along the Path at intervals between 200 and 300 milliseconds to minimize battery consumption while maintaining fluid movement
3. WHILE a Study_Session is running (not paused), THE Turtle's position SHALL correspond to (elapsed_time / total_time) × 100% of the Path length
4. WHEN the Timer reaches 00:00, THE Turtle SHALL arrive at the GOAL point of the Path (100% progress)
5. THE Progress_Bar SHALL display the Turtle's progress from 0% to 100% using the formula (elapsed_time / total_time) × 100%
6. THE Progress_Bar SHALL display a mini turtle icon on the slider head that moves rightward as progress increases from 0% to 100%
7. FOR ALL valid study durations between 1 and 180 minutes, the Turtle's position SHALL correspond to (elapsed_time / total_time) × 100% of the Path length
8. WHILE the Turtle is moving along the Path, THE Turtle SHALL always face rightward (toward the GOAL direction)
9. WHEN a Study_Session is paused, THE Turtle SHALL freeze at its current position without moving
10. WHEN a paused Study_Session is resumed, THE Turtle SHALL continue moving from its frozen position

### Requirement 5: 거북이 상태 표시

**User Story:** As a User, I want to see the turtle's different states and expressions, so that the experience feels more alive and engaging.

#### Acceptance Criteria

1. WHEN a Study_Session starts, THE Study_App SHALL display the Turtle in "걷는 중" (walking) state
2. WHILE a Study_Session is active and not paused and the Turtle is not eating, THE Study_App SHALL display the Turtle in "걷는 중" (walking) state with animated leg movement
3. THE Turtle's walking animation SHALL show leg movement without excessive vertical body motion
4. WHEN the User taps a Care_Item button in the Care_Moments_Panel while the Turtle is in "걷는 중" state, THE Study_App SHALL immediately change the Turtle_State to "먹는 중" (eating) and display the Care_Item with a fade-in animation lasting 300 milliseconds
5. THE "먹는 중" (eating) state SHALL display the turtle_eating.jpeg image showing head nodding and mouth movement for exactly 1 second
6. WHEN the "먹는 중" (eating) state duration of 1 second expires, THE Study_App SHALL transition to "기분 좋은 중" (happy) state
7. THE "기분 좋은 중" (happy) state SHALL display the turtle_happy.jpeg image with a heart effect above the turtle's head for exactly 3 seconds
8. WHEN the "기분 좋은 중" (happy) state duration of 3 seconds expires, THE Study_App SHALL return the Turtle to "걷는 중" (walking) state
9. WHEN the Timer reaches 00:00 and the Turtle reaches 100% progress, THE Study_App SHALL display the Turtle in "도착함" (arrived) state using the turtle_arrived.png image positioned next to the GOAL flag without bouncing animation
10. IF the Timer reaches 00:00 while the Turtle is in "먹는 중" or "기분 좋은 중" state, THEN THE Study_App SHALL immediately clear all asynchronous intervals and transition directly to "도착함" (arrived) state
11. WHILE a Study_Session is paused, THE Study_App SHALL display the Turtle in "자는 중" (sleeping) state on the path
12. WHEN a paused Study_Session is resumed, THE Study_App SHALL return the Turtle to its previous state (walking, happy, or eating) before the pause
13. THE Study_App SHALL complete all transitions between Turtle_States within 500 milliseconds

### Requirement 6: 돌봄 아이템 즉시 제공 (횟수 제한)

**User Story:** As a User, I want to give the turtle carrots or water immediately with limited quantities, so that I can encourage the turtle strategically during my study session.

#### Acceptance Criteria

1. WHILE a Study_Session is active, THE Study_App SHALL display the Care_Moments_Panel at the bottom left of the screen with "돌봐주기" title text above horizontally aligned carrot and water button icons
2. WHEN a Study_Session starts, THE Study_App SHALL initialize the carrot count to 3 and the water count to 3
3. THE Care_Moments_Panel SHALL display the remaining count for each Care_Item type next to its button icon (e.g., "🥕 ×3", "💧 ×3")
4. WHILE the Turtle is in "걷는 중" (walking) state AND the corresponding Care_Item count is greater than 0, THE Care_Moments_Panel button SHALL be enabled and tappable
5. WHILE the Turtle is in "먹는 중" (eating) or "기분 좋은 중" (happy) state, THE Care_Moments_Panel buttons SHALL be disabled and ignore all tap events
6. WHEN the corresponding Care_Item count reaches 0, THE Care_Moments_Panel button SHALL be disabled and visually indicate depletion (e.g., grayed out, opacity reduced)
7. WHEN the User taps a Care_Item button that has 0 remaining count, THE Study_App SHALL play a shake animation on that button without any other response
8. WHEN the User taps the carrot button in the Care_Moments_Panel while the Turtle is in "걷는 중" state AND carrot count is greater than 0, THE Study_App SHALL place a carrot Care_Item directly in front of the Turtle's head on the Path with a fade-in animation lasting 300 milliseconds AND decrement the carrot count by 1
9. WHEN the User taps the water button in the Care_Moments_Panel while the Turtle is in "걷는 중" state AND water count is greater than 0, THE Study_App SHALL place a water Care_Item directly in front of the Turtle's head on the Path with a fade-in animation lasting 300 milliseconds AND decrement the water count by 1
10. WHEN a Care_Item appears directly in front of the Turtle's head, THE Study_App SHALL immediately change the Turtle_State to "먹는 중" (eating) without requiring the Turtle to walk to the item
11. THE "먹는 중" (eating) state SHALL last for exactly 1 second
12. WHEN the "먹는 중" (eating) state duration of 1 second expires, THE Study_App SHALL change the Turtle_State to "기분 좋은 중" (happy) for 3 seconds
13. WHEN the Turtle enters "먹는 중" (eating) state, THE Study_App SHALL remove the Care_Item from the screen
14. WHEN the User taps a Care_Item button multiple times within 1 second, THE Study_App SHALL process only the first tap and ignore subsequent taps for 1 second
15. WHILE a Study_Session is paused, THE Study_App SHALL hide or disable the Care_Moments_Panel
16. THE Care_Moments_Panel SHALL allow only one Care_Item to be given at a time, enforced by disabling buttons during "먹는 중" and "기분 좋은 중" states
17. WHEN both carrot and water counts reach 0, THE Study_App SHALL keep the Care_Moments_Panel visible but with both buttons disabled

### Requirement 7: 시각적 디자인 및 분위기

**User Story:** As a User, I want to experience a warm and peaceful visual design, so that I can study in a calm and focused environment.

#### Acceptance Criteria

1. THE Study_App SHALL use colors from the defined palette (beige, light yellow, mint, olive green) for all UI components where color is applied
2. THE Study_App SHALL apply the defined color palette such that background elements use beige or light yellow, interactive elements use mint or olive green, and text maintains readable contrast ratios
3. WHILE the Study_App is in any operational state, THE Study_App SHALL display a background image depicting landscape elements (hills, lakes, trees, flowers)
4. WHILE the Study_App is in any operational state, THE Study_App SHALL display at least three decorative elements selected from: wooden signs, plants, stones, bushes, trees, or flags
5. THE Study_App SHALL apply the same color palette, background image style, and decorative element style to all screens including: home screen, study session screen, and completion screen
6. IF a background image or decorative element fails to load, THEN THE Study_App SHALL display a solid color background using beige from the defined palette
7. WHEN transitioning between screens, THE Study_App SHALL preserve the color palette and visual element style without introducing new colors or conflicting design patterns

### Requirement 8: 세션 완료 처리

**User Story:** As a User, I want to see a completion screen when my study session ends, so that I feel a sense of accomplishment.

#### Acceptance Criteria

1. WHEN the Timer reaches 00:00, THE Study_App SHALL display a completion screen within 500 milliseconds
2. THE completion screen SHALL show the Turtle in "도착함" (arrived) state at the GOAL point with a heart flag
3. THE completion screen SHALL display the total study duration completed in MM:SS format
4. THE completion screen SHALL provide a button to start a new Study_Session that opens the Time_Input_Popup when tapped
5. THE completion screen SHALL provide a close button that dismisses the completion screen and returns to the home screen

### Requirement 9: 비인터랙션 영역 터치 처리

**User Story:** As a User, I want the app to ignore touches on non-interactive areas, so that I can focus on my study without distractions.

#### Acceptance Criteria

1. WHEN the User taps on a non-interactive area of the screen (background, path, decorative elements), THE Study_App SHALL ignore the tap with no visual or behavioral response
2. WHEN an invalid action is attempted, THE Study_App SHALL preserve the current Timer value, Turtle position, and Study_Session status without modification

### Requirement 10: 세션 중단 및 재개

**User Story:** As a User, I want to pause or stop my study session if needed, so that I can take breaks or handle interruptions.

#### Acceptance Criteria

1. WHILE a Study_Session is active (running or paused), THE Study_App SHALL provide pause and stop buttons in the bottom right SessionControls area as round square buttons
2. WHEN the User taps the pause button (⏸️), THE Study_App SHALL pause the Timer, freeze the Turtle's position, change the Turtle to "자는 중" (sleeping) state, and pause the 3-second happy state timer if active
3. WHILE a Study_Session is paused, THE Study_App SHALL display a resume button in place of the pause button
4. WHEN the User taps the resume button, THE Study_App SHALL resume the Timer, Turtle movement, restore the Turtle's previous state (walking or happy), and resume the happy state timer if it was active
5. WHILE a Study_Session is active or paused, THE Study_App SHALL provide a stop button (⏹️)
6. WHEN the User taps the stop button, THE Study_App SHALL display a confirmation dialog asking "Are you sure you want to stop this session?"
7. WHEN the User confirms the stop action in the confirmation dialog, THE Study_App SHALL end the Study_Session and return to the home screen
8. WHEN the User cancels the stop action in the confirmation dialog, THE Study_App SHALL dismiss the dialog and maintain the current Study_Session state (active or paused)

### Requirement 11: 반응형 터치 인터랙션

**User Story:** As a User, I want the app to respond immediately to my touch inputs, so that the experience feels smooth and responsive.

#### Acceptance Criteria

1. WHEN the User taps any interactive element (button, Care_Item button in Care_Moments_Panel, or Time_Input_Popup control), THE Study_App SHALL display a visual change to that element within 100 milliseconds
2. WHEN the User taps a Care_Item button in the Care_Moments_Panel, THE Study_App SHALL place the Care_Item on the Path within 200 milliseconds
3. WHEN the User taps a button (pause, resume, stop, or time confirmation), THE Study_App SHALL initiate the corresponding state change within 300 milliseconds
4. WHEN the User taps an interactive element, THE Study_App SHALL ignore any subsequent taps on the same element within 500 milliseconds by providing no visual feedback and executing no action
5. THE visual change for tap feedback SHALL be a visible modification to the tapped element such as opacity change, scale animation, or highlight effect

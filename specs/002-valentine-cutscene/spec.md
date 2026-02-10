# Feature Specification: Valentine Cutscene & Message Enhancement

**Feature Branch**: `002-valentine-cutscene`
**Created**: 2026-02-10
**Status**: Draft
**Input**: User description: "Enhanced valentine message overlay with styled question, acceptance interaction, stamp animation, sunset transition, character meeting cutscene, and fireworks celebration."

## Assumptions

- The existing game already has a message overlay that displays after the player collects the power-up at the castle
- The message paragraph text is the same casual valentine message already in the codebase, except the closing question "darling, may I be your valentine?" is removed from the paragraph body — it appears only in the styled question section below the paragraph
- The "male character" who walks out of the castle is a new character sprite distinct from the player character (the player character represents the girlfriend)
- The cutscene is non-interactive (player watches it play out) except for the yes/yes button choice
- The fireworks sequence runs indefinitely (or loops) as the final celebratory state of the game
- "Not too pixelated" means the message overlay should use HTML/CSS text rendering rather than canvas-drawn text, so fonts render crisply at any screen size

## Clarifications

### Session 2026-02-10

- Q: Does the player character (girlfriend) also walk toward the male character during the meeting cutscene, or stay still? → A: Girlfriend stays still; the male character walks all the way to her.
- Q: Should "may I be your valentine?" be removed from the paragraph body to avoid duplication with the styled question below? → A: Yes, remove it from the paragraph; only show it in the styled question section below.
- Q: Should the cutscene include audio (music, sound effects, or neither)? → A: Sound effects only for key moments (stamp slam, firework launch/burst) — no background music.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Styled Valentine Message with Question (Priority: P1)

After collecting the power-up and tapping "Read the Message", the player sees a beautifully styled valentine message overlay. The main paragraph appears in clean, readable text (not pixelated). Below the paragraph, the question "May I be your valentine?" is displayed in a distinct, loving style with decorative fonts and warm colors. Two buttons appear below the question: "Yes" and "yes" (both lead to the same acceptance outcome, as a playful romantic gesture).

**Why this priority**: This is the core emotional payoff of the entire game. The message must look beautiful and be easy to read, since it's the actual valentine proposal.

**Independent Test**: Can be tested by reaching the power-up, tapping "Read the Message", reading the styled text, and clicking either button.

**Acceptance Scenarios**:

1. **Given** the player has collected the power-up, **When** they tap "Read the Message", **Then** a message overlay appears with the valentine paragraph in clean, non-pixelated text
2. **Given** the message overlay is visible, **When** the player reads it, **Then** the question "May I be your valentine?" appears below the paragraph in a distinctive romantic font style with warm colors
3. **Given** the question is displayed, **When** the player sees the buttons, **Then** two options are shown: "Yes" and "yes" (both are acceptance)
4. **Given** the two buttons are shown, **When** the player taps either "Yes" or "yes", **Then** the same acceptance flow is triggered

---

### User Story 2 - Stamp of Approval Animation (Priority: P1)

After clicking either button, a "stamp of approval" animation plays on the message. A stamp graphic appears and lands on the bottom-right area of the letter with a satisfying visual impact, bearing the word "Yes". The stamp should feel like a rubber stamp being pressed down onto paper.

**Why this priority**: This provides immediate, delightful feedback to the acceptance choice before transitioning to the cutscene.

**Independent Test**: Can be tested by clicking "Yes" or "yes" and observing the stamp animation on the message overlay.

**Acceptance Scenarios**:

1. **Given** the player taps either button, **When** the stamp animation begins, **Then** a stamp graphic animates onto the bottom-right of the message with the text "Yes"
2. **Given** the stamp has landed, **When** the animation completes, **Then** the stamp remains visible briefly before the message overlay closes

---

### User Story 3 - Sunset Sky Transition (Priority: P1)

After the message closes, the game background sky smoothly transitions from its current pink daytime palette to a warm evening/sunset gradient (deep oranges, purples, and warm pinks). This sets the romantic mood for the character meeting cutscene.

**Why this priority**: The sky transition creates the emotional atmosphere needed for the romantic cutscene that follows.

**Independent Test**: Can be tested by completing the stamp animation and observing the sky color gradually shift to sunset tones.

**Acceptance Scenarios**:

1. **Given** the stamp animation has completed and the message closes, **When** the transition begins, **Then** the sky gradually dims from daytime pink to sunset/evening colors over approximately 2-3 seconds
2. **Given** the sky is transitioning, **When** the transition completes, **Then** the sky settles into a warm sunset gradient (deep orange, purple, warm pink tones)

---

### User Story 4 - Character Meeting Cutscene (Priority: P1)

After the sky transition, the player character (the girlfriend) remains standing still near the castle area. A male character walks out of the castle door heading toward her. Once the male character reaches her, both characters face each other and a chat bubble appears above and between them containing a beating/pulsing heart.

**Why this priority**: This is the romantic climax of the game, visually showing the couple coming together.

**Independent Test**: Can be tested by completing the sky transition and watching the male character walk from the castle to the player, then observing the chat bubble with beating heart.

**Acceptance Scenarios**:

1. **Given** the sunset transition has completed, **When** the cutscene begins, **Then** the player character (girlfriend) remains standing still and a male character sprite walks out of the castle door moving toward her
2. **Given** the male character reaches the girlfriend, **When** they meet, **Then** both characters face each other and a chat bubble appears above and between them
3. **Given** the chat bubble is visible, **When** the player looks at it, **Then** the bubble contains a heart that visually pulses/beats in a rhythmic animation

---

### User Story 5 - Fireworks Celebration (Priority: P1)

After the beating heart moment, fireworks begin launching from behind the castle. Multiple colorful firework bursts appear in the evening sky, creating a celebratory atmosphere. The fireworks continue as the final celebratory state of the game.

**Why this priority**: Fireworks are the grand finale that ties the entire experience together with joy and celebration.

**Independent Test**: Can be tested by completing the character meeting and observing fireworks launching and bursting in the sky behind the castle.

**Acceptance Scenarios**:

1. **Given** the beating heart has been shown for a moment, **When** the fireworks begin, **Then** firework particles launch upward from behind the castle
2. **Given** fireworks are active, **When** a firework reaches its peak height, **Then** it bursts into a colorful explosion of particles
3. **Given** fireworks are active, **When** the player watches, **Then** multiple fireworks launch at staggered intervals creating a continuous celebration

---

### Edge Cases

- What happens if the player taps the message overlay background instead of a button? (Nothing; only the "Yes"/"yes" buttons trigger the acceptance flow)
- What happens if the player's device goes to sleep during the cutscene? (Cutscene resumes from current state when device wakes)
- What happens if the player rotates their device during the cutscene? (The orientation prompt appears as normal; cutscene pauses until landscape is restored)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Message overlay text MUST render in clean, non-pixelated typography (using system or web-safe fonts rather than canvas pixel text)
- **FR-002**: The question "May I be your valentine?" MUST appear below the main paragraph with distinct romantic styling (different font, warm colors, larger size)
- **FR-003**: Two buttons labeled "Yes" and "yes" MUST appear below the question, both triggering the same acceptance flow
- **FR-004**: Upon button click, a stamp animation MUST appear on the bottom-right of the message bearing the word "Yes"
- **FR-005**: The stamp animation MUST convey a rubber-stamp-on-paper feel (scaling down, slight rotation, impact effect)
- **FR-006**: After the stamp animation completes, the message overlay MUST close
- **FR-007**: After the message closes, the sky MUST transition from the current daytime palette to sunset/evening colors over 2-3 seconds
- **FR-008**: After the sky transition, a male character MUST walk out from the castle toward the player character
- **FR-009**: The male character MUST be visually distinct from the player character (different colors, appearance)
- **FR-010**: When the two characters are near each other, both MUST stop walking and a chat bubble MUST appear above and between them
- **FR-011**: The chat bubble MUST contain a heart that pulses/beats rhythmically
- **FR-012**: After the beating heart has been visible for a brief moment, fireworks MUST begin launching from behind the castle
- **FR-013**: Fireworks MUST burst into colorful particle explosions at their peak height
- **FR-014**: Multiple fireworks MUST launch at staggered intervals for a continuous celebration effect
- **FR-015**: The fireworks celebration MUST continue as the final state of the game (looping indefinitely)
- **FR-016**: The entire cutscene sequence (stamp, sky, walk, bubble, fireworks) MUST play automatically without user interaction after the initial button press
- **FR-017**: Sound effects MUST play for key cutscene moments: stamp slam impact and firework launch/burst. No background music during the cutscene.

### Key Entities

- **Message Overlay**: Enhanced to use HTML/CSS text rendering, includes styled question section and two acceptance buttons
- **Stamp**: Visual element that animates onto the message with a "Yes" approval mark
- **Male Character**: New character sprite that emerges from the castle; distinct appearance from the player character
- **Chat Bubble**: Speech/thought bubble that appears between two characters, containing a beating heart
- **Firework**: Particle effect that launches upward and bursts into colorful sparks at peak height
- **Sky State**: The background gradient that transitions from daytime to sunset/evening palette

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Message text is crisp and readable at all supported screen sizes without pixelation
- **SC-002**: The complete cutscene sequence (stamp through fireworks) plays within 15-20 seconds total
- **SC-003**: The cutscene runs smoothly at 60 frames per second on mobile devices
- **SC-004**: All 5 cutscene phases (stamp, sky transition, character walk, chat bubble, fireworks) play in the correct sequential order without skipping
- **SC-005**: Both "Yes" and "yes" buttons trigger identical acceptance flows
- **SC-006**: Fireworks continue indefinitely after the cutscene completes, providing a satisfying end state

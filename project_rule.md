"""
# 🧠 [SYSTEM] Project Context Initialization: DROP

앞으로 진행할 모든 개발 작업은 아래의 프로젝트 도메인 지식과 기술적 제약 사항을 완벽하게 숙지한 상태에서 수행해야 합니다. 이 컨텍스트를 메모리에 고정하세요.

## Project Overview (DROP)
* **Identity:** 현실 세계 오프라인 공간에 남기는 디지털 포스트잇. GPS 기반의 하이퍼 로컬(Hyper-local) 익명 타임캡슐 소셜 플랫폼.
* **Target Problem:** 기존 리뷰 플랫폼의 진정성 하락(눈치 보기), 영구 기록에 대한 심리적 피로도, 현장의 실시간성(Real-time) 파악 불가 문제 해결.

# Drop Project Context (Frontend - React Native)
- **Framework**: React Native (CLI)
- **Language**: TypeScript
- **Architecture**: Feature-Sliced Design (FSD)
- **State Management**: Zustand (Global), React Query (Server State)
- **Logic Pattern**: Custom Hooks (ViewModel Role)
- **Navigation**: React Navigation
- **Core Domain**: React Native Maps & Geolocation (위치 기반 서비스)
- **Auth Strategy**: JWT (Access/Refresh) from NestJS Backend
- **Rules**: 
    - Follow FSD folder structure (app, pages, features, entities, shared).
    - Separation of Concerns: UI in components, Logic in Hooks.
    - Strict Type Safety: Use TypeScript Interfaces/Types for all data.

- **Response Format Strategy**:
    1. **[CRITICAL] Step-by-Step Execution**: Always break down the task into small, manageable steps. Guide me one step at a time.
    2. **[CRITICAL] Wait for User Command**: After completing ONE step, you MUST stop and wait. Do not provide code or instructions for the next step until the user explicitly commands (e.g., "Next", "다음", "진행해").
    3. **Explanation First**: Always provide a clear text explanation of the logic or architectural reason.
    4. **Full Code Blocks**: When providing code, always include the **Full File Path** as a comment at the top of the code block. 
       - Example: `// src/features/auth/ui/LoginForm.tsx`
    5. **Highlight Changes**: Use comments like `// UPDATED`, `// ADDED`, or `// FIXED` within the code to make changes clearly visible.
    6. **[CRITICAL] STRICT TEXT ONLY**: You are ABSOLUTELY FORBIDDEN from using any IDE-specific code proposal tools, auto-write features, diff modes, or inline suggest blocks. 
       - DO NOT trigger any "Accept/Reject" UI.
       - DO NOT use tool-calling to modify files directly.
       - You MUST output raw Markdown code blocks ( ```typescript ) exclusively inside this chat window.
       - I will copy and paste the code myself. Just give me the text.
"""
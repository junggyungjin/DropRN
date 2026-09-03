# DROP - Mobile Application (React Native)

> **"지금 내 주변, 50m 안의 진짜 이야기"**
>
> DROP App은 현실 세계 오프라인 공간에 남기는 '디지털 포스트잇'이자, GPS 기반의 하이퍼 로컬(Hyper-local) 익명 타임캡슐 소셜 플랫폼의 클라이언트 애플리케이션입니다. 기존 리뷰 플랫폼의 피로도와 진정성 하락 문제를 해결하며, 유지보수성과 확장성을 극대화하기 위해 **FSD(Feature-Sliced Design)** 아키텍처를 도입하여 철저한 관심사 분리를 준수하여 설계되었습니다.

---

## Key Highlights

- **Modern Tech Stack**: React Native (CLI), TypeScript, Zustand, React Query, NativeWind.
- **Architecture**: FSD (Feature-Sliced Design) 아키텍처를 통한 비즈니스 로직과 UI의 완벽한 분리.
- **Core Features**:
  - **Location-Bounded**: `React Native Maps` 및 `Geolocation`을 활용하여 사용자 위치 반경 50m 이내의 데이터만 실시간으로 렌더링.
  - **Volatility & Anonymity**: 흔적 없이 사라지는 타임밤(Time-Bomb) 기능과 100% 완전 익명성 기반 소셜 인터랙션.
  - **Auth & Security**: Google OAuth2 및 `Encrypted Storage`를 활용한 안전한 JWT(Access/Refresh) 기반 로컬 인증 처리.

---

## Tech Stack & Libraries

| Category | Technology |
| --- | --- |
| **Language** | TypeScript |
| **Framework** | React Native (CLI) |
| **Architecture** | Feature-Sliced Design (FSD) |
| **State Management** | Zustand (Global State) |
| **Server State** | React Query (`@tanstack/react-query`) |
| **Navigation** | React Navigation (`@react-navigation/native-stack`) |
| **Map & Geo** | `react-native-maps`, `@mj-studio/react-native-naver-map`, `Geolocation` |
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Security / Auth** | `react-native-encrypted-storage`, `Google Sign-In` |

---

## Architecture & Module Strategy

DROP App은 앱의 복잡도가 증가해도 유지보수성을 잃지 않도록 **FSD(Feature-Sliced Design)** 방법론을 채택하여 계층(Layer)과 도메인(Slice) 간의 의존성을 엄격하게 관리합니다.

### Folder Structure (Feature-Sliced Design)
- **`app/`**: 애플리케이션의 최상단 진입점. 전역 Provider, Navigation Root, 글로벌 스타일 등 앱 전체 환경을 초기화하는 계층.
- **`pages/`**: 라우팅의 단위가 되는 스크린 컴포넌트 계층. (독립적인 여러 Feature들의 조합)
- **`features/`**: 사용자에게 비즈니스 가치를 제공하는 구체적인 상호작용 단위 (예: `auth`, `drop-create`, `map-view` 등).
- **`entities/`**: 비즈니스 도메인 핵심 엔티티. 특정 도메인의 데이터 모델, 타입, 도메인 종속적인 UI 뼈대 정의.
- **`shared/`**: 프로젝트 전반에서 재사용되는 공통 UI 컴포넌트(Button, Input 등), 유틸리티, API 통신 클라이언트, 디자인 시스템.

---

## Engineering Standards (핵심 설계 원칙)

### 1. UI & Logic Separation (관심사 분리)
- **Custom Hooks (ViewModel Role)**: 컴포넌트 내부에 비즈니스 로직이나 상태 관리 로직을 직접 노출하지 않고, Custom Hook으로 추출하여 뷰(View)와 로직(ViewModel)을 완벽히 분리합니다. UI 컴포넌트는 오직 렌더링에만 집중합니다.
- **Server State vs Global State**: 서버와의 동기화가 필요한 데이터(페칭, 캐싱)는 `React Query`에 전담시키고, 클라이언트 내부의 순수 UI/전역 상태는 `Zustand`로 관리하여 책임을 명확히 나눕니다.

### 2. Strict Type Safety
- **Interface & Types**: 모든 컴포넌트의 Props, API 응답/요청 데이터, 상태 객체는 반드시 TypeScript Interface 또는 Type으로 명시적으로 정의합니다.
- 백엔드의 DTO 규격(`~ResponseDto`, `~RequestDto`)과 정확히 일치하는 클라이언트 타입을 강제하여 프론트-백엔드 간 통신 안정성을 확보합니다.

### 3. FSD Cross-Import Rules
- 상위 계층은 하위 계층을 import 할 수 있지만, **하위 계층은 상위 계층을 절대 import 할 수 없습니다.** 
  - (O) `pages` -> `features` -> `entities` -> `shared`
  - (X) `shared` -> `entities`
- 동일 계층 내부의 다른 슬라이스(Slice) 간 직접적인 의존 및 import는 금지하며, 필요시 상위 계층에서 조합(Composition)합니다.

### 4. UX & Styling Optimization
- **NativeWind**: Tailwind CSS 유틸리티 기반의 스타일링을 도입하여 스타일 코드의 파편화를 막고 일관된 디자인 시스템을 신속하게 적용합니다.
- **Haptic Feedback**: 사용자의 핵심 인터랙션(드롭 생성, 투표, 알림 등)에 `react-native-haptic-feedback`을 세밀하게 적용하여 물리적인 조작감을 제공합니다.

---

## How to Run

1. **Prerequisites**
    - Node.js (v22.11.0 이상)
    - Ruby 및 CocoaPods (iOS 빌드 시)
    - Android Studio / Xcode (에뮬레이터 및 네이티브 빌드 도구)

2. **Environment Setup**
    - 프로젝트 루트에 `.env` 파일을 생성하고, 백엔드 API URL 주소 및 Google OAuth Client ID 등을 설정합니다.

3. **Running the App**
    ```bash
    # Install dependencies
    $ npm install

    # iOS Pod install (if on macOS)
    $ cd ios && pod install && cd ..

    # Start Metro Bundler
    $ npm run start

    # Run on Android
    $ npm run android

    # Run on iOS
    $ npm run ios
    ```

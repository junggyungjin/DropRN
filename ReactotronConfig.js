import Reactotron from 'reactotron-react-native';

Reactotron
    .configure({
        name: "DropRN" // Reactotron 앱 상단에 표시될 프로젝트 이름
    })
    .useReactNative({
        networking: {
            // Metro 번들러의 내부 통신(에러 위치 추적 등) 로그가 
            // API 로그와 섞여 지저분해지는 것을 방지
            ignoreUrls: /symbolicate/
        },
    }) // 기본 RN 플러그인 모두 사용
    .connect(); // 데스크톱 앱과 연결

console.log = Reactotron.log;
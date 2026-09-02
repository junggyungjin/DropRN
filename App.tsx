// App.tsx
import React from "react";
import Toast from 'react-native-toast-message';
import { RootNavigator } from "@/app/providers/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

GoogleSignin.configure({
    webClientId: '626856768578-dea9aktqr7cvajjihjnppska42lpo9tf.apps.googleusercontent.com',
    iosClientId: '626856768578-nl1fpc90403r141m0qtoq6qu62hiqg78.apps.googleusercontent.com',
});

const queryClient = new QueryClient();

const App = () => {
    return (
        // 2. 앱 최상단을 QueryClientProvider로 감싸서 하위 컴포넌트에 캐시 컨텍스트 제공
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <RootNavigator />
                </NavigationContainer>
            </SafeAreaProvider>

            <Toast />
        </QueryClientProvider>
    );
};

export default App;
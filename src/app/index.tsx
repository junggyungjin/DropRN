import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from '@/pages/splash/ui/SplashScreen';

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator id="RootStack"
                        screenOptions={{ headerShown: false }}>
                        <Stack.Screen name='Splash' component=
                            {SplashScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
};
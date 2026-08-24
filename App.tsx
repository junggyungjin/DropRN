// App.tsx
import React from "react";
import { RootNavigator } from "@/app/providers/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { SafeAreaProvider } from "react-native-safe-area-context";

GoogleSignin.configure({
    webClientId: '626856768578-dea9aktqr7cvajjihjnppska42lpo9tf.apps.googleusercontent.com',
    iosClientId: '626856768578-nl1fpc90403r141m0qtoq6qu62hiqg78.apps.googleusercontent.com',
});

const App = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>

    );
};

export default App;
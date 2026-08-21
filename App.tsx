// App.tsx
import React from "react";
import { RootNavigator } from "@/app/providers/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";

const App = () => {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
};

export default App;
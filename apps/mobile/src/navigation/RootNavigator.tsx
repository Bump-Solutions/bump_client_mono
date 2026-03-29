import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/auth/AuthContext';
import { AuthStack } from '../stacks/AuthStack';
import { HomeStack } from '../stacks/HomeStack';
import { ProfileStack } from '../stacks/ProfileStack';
import SearchScreen from '../screens/search/SearchScreen';
import SellScreen from '../screens/sell/SellScreen';
import { ROUTES } from './routes';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

export const RootNavigator = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!auth ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="HomeStack" component={HomeStack} />
            <Stack.Screen name="ProfileStack" component={ProfileStack} />
            <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} />

            {/* GLOBAL MODALS */}
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name={ROUTES.SELL} component={SellScreen} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

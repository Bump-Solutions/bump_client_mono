import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/auth/AuthContext';
import { AuthStack } from '../stacks/AuthStack';

import SellScreen from '../screens/sell/SellScreen';

import { ROUTES } from './routes';
import { HomeStack } from '../stacks/HomeStack';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { auth } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
                    
            <Stack.Screen name="HomeStack" component={HomeStack} />

            {/* GLOBAL MODALS */}
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name={ROUTES.SELL} component={SellScreen} />
            </Stack.Group>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};  
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/HomeScreen';
import ProductScreen from '../screens/product/ProductScreen';
import { ScreenWrapper } from '../navigation/ScreenWrapper';

import { ROUTES } from '../navigation/routes';

const Stack = createStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.HOME}
        component={() => (
          <ScreenWrapper>
            <HomeScreen />
          </ScreenWrapper>
        )}
      />
      <Stack.Screen
        name={ROUTES.PRODUCT.ROOT}
        component={() => (
          <ScreenWrapper>
            <ProductScreen />
          </ScreenWrapper>
        )}
      />
    </Stack.Navigator>
  );
};

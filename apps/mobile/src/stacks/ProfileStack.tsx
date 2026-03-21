import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

import { ROUTES } from '../navigation/routes';

const Stack = createStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.PROFILE.ROOT} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.SETTINGS.ROOT} component={SettingsScreen} />
    </Stack.Navigator>
  );
};
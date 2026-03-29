import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { ROUTES } from '../navigation/routes';
import { AppBar } from '../components/navigation/AppBar';

const Stack = createStackNavigator();

export type ProfileStackParamList = {
  [ROUTES.PROFILE.ROOT]: { username?: string };
  [ROUTES.SETTINGS.ROOT]: undefined;
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <AppBar />,
      }}
    >
      <Stack.Screen 
        name={ROUTES.PROFILE.ROOT} 
        component={ProfileScreen} 
        initialParams={{ username: undefined }}
      />
      <Stack.Screen name={ROUTES.SETTINGS.ROOT} component={SettingsScreen} />
    </Stack.Navigator>
  );
};

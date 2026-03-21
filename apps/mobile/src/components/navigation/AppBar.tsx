import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';

type RootStackParamList = {
  Home: undefined;
};

interface AppBarProps {
  onSearchPress: () => void;
  onNotificationsPress: () => void;
  onProfilePress: () => void;
  options: string[];
}

export const AppBar: React.FC<AppBarProps> = ({
  onSearchPress,
  onNotificationsPress,
  onProfilePress,
  options,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Text style={styles.title}>bump.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
          <TextInput placeholder="Találd meg a legújabb sneakered..." editable={false} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onNotificationsPress} style={styles.iconButton}>
          <Text>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
          <Image
            source={{ uri: 'https://placekitten.com/40/40' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity key={option} style={styles.optionButton}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', paddingBottom: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  title: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  searchContainer: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#eee',
    borderRadius: 30,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  iconButton: { marginHorizontal: 4 },
  profileImage: { width: 36, height: 36, borderRadius: 18 },
  optionsRow: { flexDirection: 'row', paddingLeft: 16, marginTop: 8 },
  optionButton: { marginRight: 16 },
  optionText: { fontSize: 15, fontWeight: '500' },
});
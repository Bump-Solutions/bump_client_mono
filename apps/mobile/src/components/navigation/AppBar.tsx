import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';
import { ProfileDropdown } from './ProfileDropdown';
import { useAuthWithMeta } from '../../hooks/auth/useAuthWithMeta';

interface AppBarProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  options?: string[];
}

export const AppBar: React.FC<AppBarProps> = ({
  onSearchPress,
  onNotificationsPress,
  options = ['Neked', 'Böngészés', 'Közösség'],
}) => {
  const navigation = useNavigation<any>();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { meta } = useAuthWithMeta();

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate(ROUTES.SEARCH);
    }
  };

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      navigation.navigate(ROUTES.NOTIFICATIONS);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOME)}>
            <Text style={styles.title}>bump.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
            <TextInput 
              placeholder="Találd meg a legújabb sneakered..." 
              editable={false} 
              style={styles.searchInput}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsProfileOpen(true)} style={styles.iconButton}>
            <Image
              source={{ uri: meta?.profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
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

        <ProfileDropdown 
          isVisible={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: { 
    backgroundColor: 'white', 
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    height: 50,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '900', 
    letterSpacing: -0.5,
    color: '#000',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 13,
    color: '#666',
  },
  iconButton: { 
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  profileImage: { 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  optionsRow: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    marginTop: 12,
  },
  optionButton: { 
    marginRight: 24,
  },
  optionText: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#000',
  },
});

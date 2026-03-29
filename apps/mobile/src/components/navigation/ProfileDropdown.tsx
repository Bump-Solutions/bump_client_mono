import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/auth/AuthContext';
import { useLogout } from '../../hooks/auth/useLogout';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { ROUTES } from '../../navigation/routes';
import { useAuthWithMeta } from '../../hooks/auth/useAuthWithMeta';

interface ProfileDropdownProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isVisible, onClose }) => {
  const { auth } = useAuth();
  const { meta } = useAuthWithMeta();
  const logout = useLogout();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  const navigateTo = (route: string, params?: any) => {
    onClose();
    
    // Check if it's a profile route and use stack if needed
    if (route.startsWith('Profile')) {
       navigation.dispatch(
         CommonActions.navigate({
           name: ROUTES.PROFILE.STACK,
           params: {
             screen: ROUTES.PROFILE.ROOT,
             params: params,
           },
         })
       );
    } else {
       navigation.navigate(route, params);
    }
  };

  if (!auth) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdownContainer}>
          <SafeAreaView>
            <ScrollView bounces={false}>
              <TouchableOpacity 
                style={styles.header}
                onPress={() => navigateTo(ROUTES.PROFILE.ROOT, { username: auth.user.username })}
              >
                <Text style={styles.username}>{auth.user.username}</Text>
                {meta?.email && <Text style={styles.email}>{meta.email}</Text>}
              </TouchableOpacity>

              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.item} 
                  onPress={() => navigateTo(ROUTES.SELL)}
                >
                  <Text style={[styles.itemText, styles.sellText]}>🏷️ Add el most!</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.item}
                  onPress={() => navigateTo(ROUTES.PROFILE.ROOT, { username: auth.user.username })}
                >
                  <Text style={styles.itemText}>👤 Bump profilom</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.item}
                  onPress={() => navigateTo(ROUTES.INBOX.ROOT)}
                >
                  <Text style={styles.itemText}>💬 Üzenetek</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.item}
                  onPress={() => navigateTo(ROUTES.PROFILE.SAVED)}
                >
                  <Text style={styles.itemText}>🔖 Mentett</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.item}
                  onPress={() => navigateTo(ROUTES.ORDERS)}
                >
                  <Text style={styles.itemText}>📦 Rendelések</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity 
                  style={styles.item}
                  onPress={() => navigateTo(ROUTES.SETTINGS.ROOT)}
                >
                  <Text style={styles.itemText}>⚙️ Beállítások</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.item, styles.lastItem]} 
                onPress={handleLogout}
              >
                <Text style={[styles.itemText, styles.logoutText]}>Kijelentkezés</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  dropdownContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  item: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  sellText: {
    color: '#000',
    fontWeight: '700',
  },
  logoutText: {
    color: '#ff4444',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});

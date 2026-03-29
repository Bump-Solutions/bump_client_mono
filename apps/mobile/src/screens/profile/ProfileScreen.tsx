import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/auth/AuthContext';
import { useAuthWithMeta } from '../../hooks/auth/useAuthWithMeta';
import { useGetUser } from '../../hooks/user/useGetUser';
import { useFollow } from '../../hooks/user/useFollow';
import { useUnfollow } from '../../hooks/user/useUnfollow';

type ProfileScreenRouteProp = RouteProp<{ Profile: { username?: string } }, 'Profile'>;

const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { auth } = useAuth();
  const { meta: myMeta } = useAuthWithMeta();
  
  const targetUsername = route.params?.username || auth?.user.username;
  const isOwnProfile = !route.params?.username || route.params.username === auth?.user.username;

  const { user, setUser, isLoading, error } = useGetUser(targetUsername);
  const { performFollow, isLoading: isFollowing } = useFollow();
  const { performUnfollow, isLoading: isUnfollowing } = useUnfollow();

  const [activeTab, setActiveTab] = useState('Termékek');

  const handleFollow = async () => {
    if (!user) return;
    try {
      if (user.following) {
        await performUnfollow(user.id);
        setUser({ ...user, following: false, followersCount: user.followersCount - 1 });
      } else {
        await performFollow(user.id);
        setUser({ ...user, following: true, followersCount: user.followersCount + 1 });
      }
    } catch (e) {
      // Error handled in hook
    }
  };

  if (isLoading && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.centered}>
        <Text>Hiba történt a profil betöltése közben.</Text>
      </View>
    );
  }

  const profilePicture = isOwnProfile ? myMeta?.profilePicture : user.profilePicture;
  const bannerColor = user.profileBackgroundColor || '#cbd3de';

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: bannerColor }]} />

      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.headerRow}>
          <Image
            source={{ uri: profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
            style={styles.profileImage}
          />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.followersCount}</Text>
              <Text style={styles.statLabel}>Követő</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.followingsCount}</Text>
              <Text style={styles.statLabel}>Követés</Text>
            </View>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.joinedText}>
            {isOwnProfile ? 'Csatlakoztál: ' : 'Csatlakozott: '}
            {new Date(user.joined).toLocaleDateString()}
          </Text>
        </View>

        {/* Actions */}
        {!isOwnProfile && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, user.following ? styles.secondaryButton : styles.primaryButton]}
              onPress={handleFollow}
              disabled={isFollowing || isUnfollowing}
            >
              <Text style={[styles.actionButtonText, user.following && styles.secondaryButtonText]}>
                {user.following ? 'Követés leállítása' : 'Követés'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={styles.secondaryButtonText}>Üzenet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          {['Termékek', 'Mentett'].map((tab) => {
             if (tab === 'Mentett' && !isOwnProfile) return null;
             return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
             );
          })}
        </View>

        {/* Tab Content Placeholder */}
        <View style={styles.tabContent}>
          <Text style={styles.emptyText}>Még nincsenek megjeleníthető elemek.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    height: 120,
    width: '100%',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: '#eee',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  userInfo: {
    marginTop: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: '800',
  },
  fullName: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  joinedText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: 'black',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: 'black',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'black',
  },
  tabContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen;

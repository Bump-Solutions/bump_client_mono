import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/auth/AuthContext';
import { useAuthWithMeta } from '../../hooks/auth/useAuthWithMeta';
import { useGetUser } from '../../hooks/user/useGetUser';
import { useFollow } from '../../hooks/user/useFollow';
import { useUnfollow } from '../../hooks/user/useUnfollow';
import { useListProducts, ProductListType } from '../../hooks/product/useListProducts';
import { ROUTES } from '../../navigation/routes';
import type { ProductListModel } from '@bump/core/models';

type ProfileScreenRouteProp = RouteProp<{ Profile: { username?: string } }, 'Profile'>;

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const ProductCard = ({ product }: { product: ProductListModel }) => {
  const navigation = useNavigation<any>();
  
  return (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate(ROUTES.PRODUCT.ROOT, { id: product.id })}
    >
      <View style={styles.productImageContainer}>
        <Image 
          source={{ uri: product.images[0] || 'https://via.placeholder.com/150' }} 
          style={styles.productImage} 
        />
        {product.discountedPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>%</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.productSize}>{product.size || `${product.itemsCount} méret`}</Text>
        <Text style={styles.productPrice}>
          {product.discountedPrice ? (
            <>
              <Text style={styles.discountedPrice}>{product.discountedPrice.toLocaleString()} Ft</Text>
              {' '}
              <Text style={styles.originalPriceStrikethrough}>{(product.price || product.minPrice)?.toLocaleString()} Ft</Text>
            </>
          ) : (
            <Text>{(product.price || product.minPrice)?.toLocaleString()} Ft</Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { auth } = useAuth();
  const { meta: myMeta } = useAuthWithMeta();
  
  const targetUsername = route.params?.username || auth?.user.username;
  const isOwnProfile = !route.params?.username || route.params.username === auth?.user.username;

  const [activeTab, setActiveTab] = useState<'Termékek' | 'Mentett'>('Termékek');

  const { user, setUser, isLoading: userLoading, error: userError } = useGetUser(targetUsername);
  
  const productListType: ProductListType = activeTab === 'Termékek' ? 'inventory' : 'saved';
  
  const { 
    products, 
    isLoading: productsLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    loadMore,
    refetch: refetchProducts 
  } = useListProducts(user?.id, productListType);

  const { performFollow, isLoading: isFollowing } = useFollow();
  const { performUnfollow, isLoading: isUnfollowing } = useUnfollow();

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

  const listData = useMemo(() => {
    // Add a dummy item for "Create product" if own profile and on products tab
    if (isOwnProfile && activeTab === 'Termékek') {
      return [{ id: -1, isDummy: true } as any, ...products];
    }
    return products;
  }, [products, isOwnProfile, activeTab]);

  const renderHeader = () => {
    if (!user) return null;

    const profilePicture = isOwnProfile ? myMeta?.profilePicture : user.profilePicture;
    const bannerColor = user.profileBackgroundColor || '#cbd3de';

    return (
      <View style={styles.headerContainer}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: bannerColor }]} />

        <View style={styles.headerContent}>
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
            {(['Termékek', 'Mentett'] as const).map((tab) => {
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
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.isDummy) {
      return (
        <TouchableOpacity 
          style={[styles.productCard, styles.dummyCard]}
          onPress={() => navigation.navigate(ROUTES.SELL)}
        >
          <View style={styles.dummyIconContainer}>
            <Text style={styles.dummyIcon}>+</Text>
          </View>
          <Text style={styles.dummyText}>Új termék feltöltése</Text>
        </TouchableOpacity>
      );
    }
    return <ProductCard product={item} />;
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  if (userLoading && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (userError || !user) {
    return (
      <View style={styles.centered}>
        <Text>Hiba történt a profil betöltése közben.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={listData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      refreshing={productsLoading && !isFetchingNextPage}
      onRefresh={refetchProducts}
      ListEmptyComponent={
        !productsLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Még nincsenek megjeleníthető termékek.</Text>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  listContent: {
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  columnWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginBottom: 16,
  },
  banner: {
    height: 120,
    width: '100%',
  },
  headerContent: {
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
  productCard: {
    width: COLUMN_WIDTH,
    marginBottom: 20,
  },
  productImageContainer: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    marginTop: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  productSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  discountedPrice: {
    color: '#ff4444',
  },
  originalPriceStrikethrough: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dummyCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    height: COLUMN_WIDTH + 60, // approximate total height of a product card
  },
  dummyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dummyIcon: {
    fontSize: 24,
    color: '#666',
  },
  dummyText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default ProfileScreen;

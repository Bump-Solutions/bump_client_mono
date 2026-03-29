import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useGetProduct } from '../../hooks/product/useGetProduct';
import { useAuth } from '../../context/auth/AuthContext';
import { ROUTES } from '../../navigation/routes';

type ProductScreenRouteProp = RouteProp<{ Product: { id: number } }, 'Product'>;

const { width } = Dimensions.get('window');

const ProductScreen = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { auth } = useAuth();
  const productId = route.params?.id;

  const { product, isLoading, error } = useGetProduct(productId);
  const [activeImageIndex, setActiveTabImageIndex] = useState(0);

  if (isLoading && !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text>Hiba történt a termék betöltése közben.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Vissza</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const label = [
    product.product.brand,
    product.product.model,
    product.product.colorWay,
  ].join(" ");

  const minPrice = Math.min(...product.items.map(i => i.price));
  const hasMultipleItems = product.items.length > 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{product.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const contentOffset = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffset / width);
              setActiveTabImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.mainImage} />
            ))}
          </ScrollView>
          {product.images.length > 1 && (
            <View style={styles.pagination}>
              {product.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.paginationDot, 
                    activeImageIndex === index && styles.paginationDotActive
                  ]} 
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsContent}>
          <View style={styles.badgeRow}>
            {Object.entries(product.badges).map(([key, badge]) => (
              <View key={key} style={styles.badge}>
                <Text style={styles.badgeText}>{badge.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.productLabel}>{label}</Text>
          <Text style={styles.title}>{product.title}</Text>

          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : null}

          <TouchableOpacity 
            style={styles.sellerCard}
            onPress={() => navigation.navigate(ROUTES.PROFILE.STACK, { 
              screen: ROUTES.PROFILE.ROOT, 
              params: { username: product.user.username } 
            })}
          >
            <Image 
              source={{ uri: product.user.profilePicture || 'https://www.gravatar.com/avatar/0?d=mp' }} 
              style={styles.sellerAvatar} 
            />
            <View>
              <Text style={styles.sellerName}>@{product.user.username}</Text>
              <Text style={styles.sellerLocation}>Eladó</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Elérhető méretek</Text>
            <View style={styles.sizeGrid}>
              {product.items.map((item, index) => (
                <View key={index} style={styles.sizeItem}>
                  <Text style={styles.sizeText}>{item.size}</Text>
                  <Text style={styles.sizePrice}>{item.price.toLocaleString()} Ft</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPriceInfo}>
          <Text style={styles.footerPriceLabel}>{hasMultipleItems ? 'Kezdőár' : 'Ár'}</Text>
          <Text style={styles.footerPrice}>{minPrice.toLocaleString()} Ft</Text>
        </View>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveIcon}>{product.saved ? '❤️' : '♡'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Kosárba</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f9f9f9',
  },
  mainImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000',
    width: 12,
  },
  detailsContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  productLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 20,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 24,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  sellerLocation: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeItem: {
    width: (width - 52) / 3,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sizePrice: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  footerPriceInfo: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#666',
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    fontSize: 20,
  },
  buyButton: {
    backgroundColor: 'black',
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProductScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSearch } from '../../hooks/search/useSearch';
import { ROUTES } from '../../navigation/routes';
import type { UserSearchModel, ProductSearchModel } from '@bump/core/models';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [searchKey, setSearchKey] = useState('');
  const { data, isLoading, isError, mode } = useSearch({ searchKey });

  const renderResultItem = ({ item }: { item: UserSearchModel | ProductSearchModel }) => {
    if (mode === 'users') {
      const user = item as UserSearchModel;
      return (
        <TouchableOpacity 
          style={styles.resultItem}
          onPress={() => navigation.navigate(ROUTES.PROFILE.STACK, { 
            screen: ROUTES.PROFILE.ROOT, 
            params: { username: user.username } 
          })}
        >
          <Image 
            source={{ uri: user.profilePicture || 'https://www.gravatar.com/avatar/0?d=mp' }} 
            style={styles.avatar} 
          />
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultTitle}>@{user.username}</Text>
            {user.followersCount !== undefined && (
              <Text style={styles.resultSubtitle}>{user.followersCount} követő</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      const product = item as ProductSearchModel;
      return (
        <TouchableOpacity 
          style={styles.resultItem}
          onPress={() => navigation.navigate(ROUTES.PRODUCT.ROOT, { id: product.id })}
        >
          <Image 
            source={{ uri: product.image || 'https://via.placeholder.com/50' }} 
            style={styles.productImage} 
          />
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultTitle}>{product.title}</Text>
            <Text style={styles.resultSubtitle}>{product.label}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Sneakerek, márkák, @felhasználók..."
            value={searchKey}
            onChangeText={setSearchKey}
            autoFocus
          />
          {searchKey.length > 0 && (
            <TouchableOpacity onPress={() => setSearchKey('')}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Mégsem</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Hiba történt a keresés közben.</Text>
        </View>
      )}

      {!isLoading && data?.search_result && (
        <FlatList
          data={data.search_result}
          renderItem={renderResultItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchKey.length > 0 ? (
              <View style={styles.centered}>
                <Text style={styles.emptyText}>Nincs találat a következőre: "{searchKey}"</Text>
              </View>
            ) : null
          }
        />
      )}

      {!searchKey && (
        <View style={styles.centered}>
          <Text style={styles.infoText}>Használj @ jelet felhasználók kereséséhez!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  clearText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 8,
  },
  cancelText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  resultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  resultSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  infoText: {
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen;

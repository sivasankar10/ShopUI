import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState, AppDispatch } from './store';
import { addToCart, incrementQuantity, decrementQuantity } from './cartSlice';
import { Button } from 'react-native-paper';

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  category: string;
  rating: { rate: number; count: number };
  description: string;
}

interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const addItemToCart = (product: Product) => {
    const cartItem: CartItem = {
      ...product,
      quantity: 1,  
    };
    dispatch(addToCart(cartItem));
    closeModal();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openModal(item)}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text numberOfLines={1} style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemRating}>
          <Text style={styles.itemRatingText}>
            {'⭐'.repeat(Math.round(item.rating.rate))}
          </Text>
          <Text style={styles.ratingCount}>({item.rating.count})</Text>
        </View>
        <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
        <Text style={styles.itemCategory}>Category: {item.category}</Text>
        {cart[item.id] && (
          <View style={styles.itemQuantity}>
            <Button mode="contained" onPress={() => dispatch(decrementQuantity(item.id))}>-</Button>
            <Text style={styles.quantityText}>{cart[item.id].quantity}</Text>
            <Button mode="contained" onPress={() => dispatch(incrementQuantity(item.id))}>+</Button>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {selectedProduct && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
              <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => addItemToCart(selectedProduct)}
              >
                <Text style={styles.textStyle}>Add To Cart</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemRatingText: {
    fontSize: 14,
    color: '#e67e22',
  },
  ratingCount: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#e67e22',
    marginVertical: 5,
  },
  itemCategory: {
    fontSize: 14,
    color: '#95a5a6',
  },
  itemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196f3',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default ReduxApp;

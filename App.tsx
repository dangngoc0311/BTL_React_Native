import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigation from './src/views/components/NavTab';
import firestore from '@react-native-firebase/firestore';
import { CartProvider } from './src/consts/CartContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const initializeApp = async () => {
  // Kiểm tra xem mục "carts" đã tồn tại hay chưa
  const cartsRef = firestore().collection('Carts');
  const snapshot = await cartsRef.get();

  if (snapshot.empty) {
    // Nếu mục "carts" chưa tồn tại, tạo một mục mới
    await cartsRef.doc('default').set({});
  }
};
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    initializeApp();
  }, []);
  return (
     <CartProvider >
      <AppNavigation />
    </CartProvider>
  );
};


export default App;
import React, { createContext, useState, useContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Cart } from './models';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-simple-toast';
import { ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { NavigationContainerRef } from '@react-navigation/native';
interface CartContextState {
    cartItems: Cart[];
    totalPrice: number;
    addToCart: (item: Cart) => void;
    increaseQuantity: (item: Cart) => void;
    decreaseQuantity: (item: Cart) => void;
    removeCartItem: (cartItemId: string) => void;
    orderCart: (address: any, phone: any, note: any) => void;
}
interface CartProviderProps {
    children: React.ReactNode;
    // navigation: NavigationContainerRef<any>;
}
const CartContext = createContext<CartContextState | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<Cart[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const userId = auth().currentUser?.uid;
    console.log(userId);
    useEffect(() => {
        // Fetch the cart items from Firestore and update the state
        const fetchCartItems = async () => {
            try {
                const cartSnapshot = await firestore()
                    .collection('Carts')
                    .doc(userId)
                    .collection('CartItems')
                    .get();
                const cartItems: Cart[] = [];
                let total = 0;
                console.log(cartSnapshot.docs)
                for (const doc of cartSnapshot.docs) {
                    const cartItem = doc.data() as Cart;
                    const productSnapshot = await firestore()
                        .collection('Products')
                        .doc(cartItem.productId)
                        .get();
                    const productData = productSnapshot.data();
                    const imageRef = storage().refFromURL(productData?.image);
                    const imageUrl = await imageRef.getDownloadURL();
                    const sizeSnapshot = await firestore()
                        .collection('Sizes')
                        .doc(cartItem.sizeId)
                        .get();
                    const sizeData = sizeSnapshot.data();
                    const cartItemWithDetails: Cart = {
                        ...cartItem,
                        id: doc.id,
                        productName: productData?.name || 'Unknown Product',
                        productImage: imageUrl || '',
                        productPrice: productData?.price || 0,
                        sizeName: sizeData?.name || 'Unknown Size',
                    };
                    total += +productData?.price * +cartItem.quantity;
                    cartItems.push(cartItemWithDetails);
                }
                setTotalPrice(total);
                setCartItems(cartItems);
            } catch (error) {
                console.log('Error fetching cart items:', error);
            }
        }

        fetchCartItems();
    }, []);

    const addToCart = async (item: Cart) => {
        try {
            const existingCartItem = cartItems.find(
                (cartItem) => cartItem.productId === item.productId && cartItem.sizeId === item.sizeId
            );

            if (existingCartItem) {
                console.log('bbb' + existingCartItem);
                await firestore()
                    .collection('Carts')
                    .doc(userId)
                    .collection('CartItems')
                    .doc(existingCartItem.id)
                    .update({
                        quantity: existingCartItem.quantity + 1,
                    });

                const updatedCartItems = cartItems.map((cartItem) => {
                    if (cartItem.productId === item.productId) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                        };
                    }
                    return cartItem;
                });
                setCartItems(updatedCartItems);
                setTotalPrice(+totalPrice + +item.productPrice);
            } else {
                console.log('aa' + item);
                await firestore()
                    .collection('Carts')
                    .doc(userId)
                    .collection('CartItems')
                    .add({
                        productId: item.productId,
                        quantity: item.quantity,
                        sizeId: item.sizeId,
                    });

                setCartItems([...cartItems, item]);
                setTotalPrice(+totalPrice + +item.productPrice);
            }
            Toast.showWithGravity(
                'Product added to cart.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'green',
                textColor: 'white'
            });
        } catch (error) {
            Toast.showWithGravity(
                'Error adding product to cart.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'red',
                textColor: 'white'
            });
            console.log('Error adding product to cart:', error);
        }
    };

    const increaseQuantity = async (item: Cart) => {
        const updatedCartItems = cartItems.map((cartItem) => {
            if (cartItem.id === item.id) {
                return {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                };
            }
            return cartItem;
        });
        setCartItems(updatedCartItems);
        setTotalPrice(+totalPrice + +item.productPrice);
        try {
            await firestore()
                .collection('Carts')
                .doc(userId)
                .collection('CartItems')
                .doc(item.id)
                .update({
                    quantity: item.quantity + 1,
                });

            console.log("ok")
            Toast.showWithGravity(
                'Quantity updated.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'green',
                textColor: 'white'
            });
        } catch (error) {
            Toast.showWithGravity(
                'Error updating quantity.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'red',
                textColor: 'white'
            });
            console.log('Error increase quantity product to cart:', error);
        }
    };

    const decreaseQuantity = async (item: Cart) => {
        if (item.quantity > 1) {
            const updatedCartItems = cartItems.map((cartItem) => {
                if (cartItem.id === item.id) {
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity - 1,
                    };
                }
                return cartItem;
            });
            setCartItems(updatedCartItems);
            setTotalPrice(+totalPrice - +item.productPrice);
            try {
                await firestore()
                    .collection('Carts')
                    .doc(userId)
                    .collection('CartItems')
                    .doc(item.id)
                    .update({
                        quantity: item.quantity - 1,
                    });
                console.log("ok")
                Toast.showWithGravity(
                    'Quantity updated.',
                    Toast.LONG,
                    Toast.TOP, {
                    backgroundColor: 'green',
                    textColor: 'white'
                });
            } catch (error) {
                Toast.showWithGravity(
                    'Error updating quantity.',
                    Toast.LONG,
                    Toast.TOP, {
                    backgroundColor: 'red',
                    textColor: 'white'
                });
                console.log('Error decrease quantity product to cart:', error);
            }
        }
    };

    const removeCartItem = async (cartItemId: string) => {
        try {
            await firestore()
                .collection('Carts')
                .doc(userId)
                .collection('CartItems')
                .doc(cartItemId)
                .delete();
            const updatedCartItems = cartItems.filter((item) => item.id !== cartItemId);
            setCartItems(updatedCartItems);
            const removedItem = cartItems.find((item) => item.id === cartItemId);
            if (removedItem) {
                const removedItemPrice = removedItem.quantity * removedItem.productPrice;
                setTotalPrice(+totalPrice - +removedItemPrice);
            }
            console.log("ok")
            Toast.showWithGravity(
                'Product removed.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'green',
                textColor: 'white'
            });
        } catch (error) {
            Toast.showWithGravity(
                'Error remove product.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'red',
                textColor: 'white'
            });
            console.log('Error remove product to cart:', error);
        }
    };



    
    const orderCart = async (address: any, phone: any, note: any) => {
        console.log(cartItems);
        try {
            // Add the order to the 'Orders' collection
            const orderRef = await firestore().collection('Orders').add({
                userId,
                totalAmount: totalPrice,
                address,
                phone,
                note,
                orderDate: firestore.FieldValue.serverTimestamp(),
            });
            const orderId = orderRef.id;
            const orderItems = cartItems.map((item: any) => ({
                orderId,
                productId: item.productId,
                price: item.productPrice,
                quantity: item.quantity,
            }));

            // Add the order items to the 'OrderItems' collection
            await Promise.all(
                orderItems.map((item: any) =>
                    firestore().collection('OrderItems').add(item)
                )
            );

            const cartSnapshot = await firestore()
                .collection('Carts')
                .doc(userId)
                .collection('CartItems')
                .get();
            const batch = firestore().batch();
            cartSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
            setCartItems([]);
            setTotalPrice(0);
            console.log("Order placed successfully")
            Toast.showWithGravity(
                'Order placed successfully.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'green',
                textColor: 'white'
            });
            // navigation.navigate('Home');
        } catch (error) {
            Toast.showWithGravity(
                'Error placing order.',
                Toast.LONG,
                Toast.TOP, {
                backgroundColor: 'red',
                textColor: 'white'
            });
            console.log('Error placing order:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeCartItem,
                totalPrice,
                orderCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextState => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

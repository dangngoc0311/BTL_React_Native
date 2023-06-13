import { useState, useEffect } from 'react';
import { Cart } from './models'; // Make sure to import the Cart type from your models file
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const userId = auth().currentUser?.uid;
export const addToCart = async (item: any, quantity: number, sizeId: any) => {
    const cartSnapshot = await firestore()
        .collection('Carts')
        .doc(userId)
        .collection('CartItems')
        .get();
    const existingCartItem = cartSnapshot.docs.find(
        (doc) =>
            doc.data().productId === item.id && doc.data().sizeId === sizeId
    );
    if (existingCartItem) {
        // Update the quantity if the product with the same size already exists in the cart
        const existingQuantity = existingCartItem.data().quantity;
        await firestore()
            .collection('Carts')
            .doc(userId)
            .collection('CartItems')
            .doc(existingCartItem.id)
            .update({
                quantity: existingQuantity + quantity,
            });
        console.log('Quantity updated in Firestore');
    } else {
        try {
            await firestore()
                .collection('Carts')
                .doc(userId)
                .collection('CartItems')
                .add({
                    productId: item.id,
                    quantity: quantity,
                    sizeId: sizeId,
                });
                
            console.log('Product added to cart');
        } catch (error) {
            console.log('Error adding product to cart:', error);
        }
    }
};

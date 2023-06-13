import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftCircleIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { HeartIcon, StarIcon } from 'react-native-heroicons/solid';
import COLORS from '../../consts/colors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {  Cart, Size } from '../../consts/models';

export default function DetailScreen(props: any) {
    const item = props.route.params.item;
    const navigation = useNavigation();
    const [sizes, setSizes] = useState<Size[]>([]);
    const [sizeId, setSizeId] = useState('');
    const [sizeName, setSizeName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const userId = auth().currentUser?.uid;
    const handleCheckout = () => {
        const cartItems: Cart = {
            productId: item.id,
            quantity,
            sizeId,
            id: '',
            productName: item.name,
            productImage: item.image,
            productPrice: item.price,
            sizeName,
        };
        const selectedItemsParam = [cartItems] as Cart[];
        props.navigation.navigate('Checkout', { selectedItems: selectedItemsParam });
    }
    const fetchSizes = async () => {
        try {
            const sizeSnapshot = await firestore().collection("Sizes").get();
            const sizes = sizeSnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setSizes(sizes);
        } catch (error) {
            console.log('Error fetching size:', error);
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };
    const addToCart = async () => {
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
   
    useEffect(() => {
        fetchSizes();
    }, []);
    return (
        <ScrollView style={{
            paddingTop: 0,
            backgroundColor: COLORS.white
        }}>
            <View style={{ flex: 1 }}>
                <Image
                    source={require('../../assets/beansBackground2.png')}
                    style={{ height: 280, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, width: '100%', position: 'absolute', opacity: 0.8 }} />
                <SafeAreaView style={{ marginTop: 16, marginBottom: 16 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16 }}>
                        <TouchableOpacity style={{ borderRadius: 9999 }} onPress={() => navigation.goBack()}>
                            <ArrowLeftCircleIcon size="50" strokeWidth={1.2} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ borderRadius: 9999, borderWidth: 2, borderColor: 'white', padding: 8 }}>
                            <HeartIcon size="24" color="white" />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            shadowColor: COLORS.bgDark,
                            shadowRadius: 30,
                            shadowOffset: { width: 0, height: 30 },
                            shadowOpacity: 0.9,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                        <Image source={{ uri: item.image }} style={{ height: 250, width: 250 }} />
                    </View>
                    <View style={{
                        backgroundColor: COLORS.bgLight, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 24, paddingHorizontal: 8, marginHorizontal: 16, opacity: 0.9,
                        width: 64
                    }}>
                        <StarIcon
                            style={{
                                marginRight: COLORS.SPACING / 2,
                            }}
                            color={COLORS.primary}
                            size={COLORS.SPACING * 1.7} />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{item.stars}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16 }}>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>
                            {item.name}
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold' }}>
                            $ {item.price}
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: 16 }}>
                        {/* <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Coffee size</Text> */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {sizes.map((sizeItem) => (
                                <TouchableOpacity
                                    key={sizeItem.id}
                                    onPress={() => {
                                        setSizeId(sizeItem.id);
                                        setSizeName(sizeItem.name);
                                    }}
                                    style={{
                                        backgroundColor: sizeId === sizeItem.id ? COLORS.bgLight : 'rgba(0,0,0,0.07)',
                                        padding: 12,
                                        borderRadius: 9999,
                                        marginBottom: 10,
                                        paddingHorizontal:20
                                    }}>
                                    <Text style={{ color: sizeId === sizeItem.id ? 'white' : '#4B5563' }}>
                                        {sizeItem.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>

                        <View style={{ paddingRight: 16, marginVertical: 8 }}>
                            <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 20 }}>About</Text>
                            <Text style={{ color: '#6B7280', fontSize: 16 }}>{item.des}</Text>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 16, opacity: 0.6, marginRight: 4 }}>Volume : </Text>
                                <Text style={{ color: '#000', fontWeight: '600', fontSize: 16 }}>{item.volume}</Text>
                            </View>

                            <View style={{
                                display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#6B7280', borderRadius: 9999, padding: 4, paddingHorizontal: 10
                                , width: 120, justifyContent: 'space-between'
                            }}>
                                    <TouchableOpacity onPress={decreaseQuantity}>
                                        <MinusIcon size={20} strokeWidth={3} color={COLORS.text} />
                                    </TouchableOpacity>
                                    <Text style={{ color: COLORS.text, fontWeight: 'bold', fontSize: 20, marginHorizontal: 10 }}>{quantity}</Text>
                                    <TouchableOpacity onPress={increaseQuantity}>
                                        <PlusIcon size={20} strokeWidth={3} color={COLORS.text} />
                                    </TouchableOpacity>
                            </View>
                        </View>

                        {/* buy now button */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                            <TouchableOpacity onPress={addToCart} style={{ padding: 8, borderRadius: 9999, borderWidth: 1, borderColor: '#6B7280' }}>
                                <ShoppingBagIcon size="30" color="gray" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: COLORS.bgLight, padding: 4, borderRadius: 9999 }} onPress={() => handleCheckout()} >
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: COLORS.white, fontSize: 16, lineHeight: 28, paddingHorizontal: 120, paddingVertical: 7 }}>Buy now</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </SafeAreaView>
            </View>
        </ScrollView>
    )
}
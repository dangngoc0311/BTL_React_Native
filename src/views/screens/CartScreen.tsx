import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import COLORS from '../../consts/colors';
import { PrimaryButton } from '../components/Button';
import { MinusSmallIcon, PlusSmallIcon } from 'react-native-heroicons/solid';
import { ArrowLeftCircleIcon, TrashIcon } from 'react-native-heroicons/outline';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Cart } from '../../consts/models';
import storage from '@react-native-firebase/storage';
import { useCart } from '../../consts/CartContext';

const CartScreen = ({ navigation }: any) => {
    // const [cartItems, setCartItems] = useState<Cart[]>([]);
    // const [totalPrice, setTotalPrice] = useState<number>(0);
    const userId = auth().currentUser?.uid;
    const { increaseQuantity,decreaseQuantity,removeCartItem,cartItems,totalPrice } = useCart();
    const handleDecreaseQuantity = async (item: Cart) => {
        decreaseQuantity(item);
    };
    const handleIncreaseQuantity = async (item: Cart) => {
        increaseQuantity(item);
    };
    const handleRemoveItem = async (id: any) => {
        removeCartItem(id);
    };

    const CartCard = ({ item }: any) => {
        return (
            <View style={style.cartCard}>
                <Image source={{ uri: item.productImage }} style={{ height: 80, width: 80 }} />
                <View
                    style={{
                        height: 100,
                        marginLeft: 10,
                        paddingVertical: 20,
                        flex: 1,
                    }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.black }}>{item.productName}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.grey }}>
                        {item.sizeName}
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.black }}>${item.productPrice * item.quantity}</Text>
                </View>
                <View style={{ marginRight: 20, alignItems: 'center' }}>
                    <View style={style.actionBtn}>
                        <MinusSmallIcon onPress={() => handleDecreaseQuantity(item)} size={25} color={COLORS.white} />
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.white, paddingHorizontal: 6 }}>{item.quantity}</Text>
                        <PlusSmallIcon onPress={() => handleIncreaseQuantity(item)} size={25} color={COLORS.white} />
                    </View>
                </View>
                <View>
                    <TrashIcon color={'red'} size={25} onPress={() => handleRemoveItem(item.id)}></TrashIcon>
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
            <View style={style.header}>
                <Image
                    source={require('../../assets/beansBackground2.png')}
                    style={{
                        height: 65,
                        opacity: 0.7,
                        position: 'absolute',
                        width: '100%',
                        top: 0
                    }} />
                <TouchableOpacity style={{ borderRadius: 9999, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft:20 }} onPress={() => navigation.goBack()}>
                    <ArrowLeftCircleIcon size="35" strokeWidth={1.2} color="white" />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 16,color:COLORS.white }}>Cart</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                data={cartItems}
                renderItem={({ item }) => <CartCard item={item} />}
                ListFooterComponentStyle={{ paddingHorizontal: 20, marginTop: 20 }}
                ListFooterComponent={() => (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 15,
                            }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold',color:COLORS.black }}>
                                Total Price
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold',color:COLORS.black }}>${totalPrice}</Text>
                        </View>
                        <View style={{ marginHorizontal: 30 }}>
                            <PrimaryButton title="CHECKOUT" onPress={() => navigation.navigate('Checkout', { selectedItems: cartItems})} />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};
const style = StyleSheet.create({
    header: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartCard: {
        height: 100,
        elevation: 15,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        width: 80,
        height: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
});

export default CartScreen;
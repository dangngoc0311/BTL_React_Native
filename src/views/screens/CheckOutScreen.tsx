import { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "../components/Button";
import COLORS from "../../consts/colors";
import { MapIcon, MapPinIcon, PhoneIcon } from "react-native-heroicons/outline";
import { ArrowLeftCircleIcon, InboxIcon } from "react-native-heroicons/solid";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useCart } from '../../consts/CartContext';
import Toast from 'react-native-simple-toast';

const CheckoutScreen = ({ navigation, route }: any) => {
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const selectedItems = route.params.selectedItems;
    
    const type = route.params.type;
    const { orderCart } = useCart();
    console.log(type);
    const userId = auth().currentUser?.uid;
    const handlePayment = async () => {
        console.log(type);
        //detail
        if (type==1) {
             try {
            const totalAmount = selectedItems.reduce((total: number, item: any) => total += item.productPrice * item.quantity, 0);
            const orderRef = await firestore().collection('Orders').add({
                userId,
                totalAmount,
                address,
                phone,
                note,
                orderDate: firestore.FieldValue.serverTimestamp(),
            });
            const orderId = orderRef.id;

            const orderItems = selectedItems.map((item: any) => ({
                orderId,
                productId: item.productId,
                price: item.productPrice,
                quantity: item.quantity,
            }));
            await Promise.all(orderItems.map((item:any) => firestore().collection('OrderItems').add(item)));
                 console.log("Order placed successfully")
                 Toast.showWithGravity(
                     'Order placed successfully.',
                     Toast.LONG,
                     Toast.TOP, {
                     backgroundColor: 'green',
                     textColor: 'white'
                 });
                 navigation.navigate('Home');
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
        }else{
            orderCart(address,phone,note);
        }
    };
 
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
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
                <TouchableOpacity style={{ borderRadius: 9999, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20 }} onPress={() => navigation.goBack()}>
                    <ArrowLeftCircleIcon size="35" strokeWidth={1.2} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16, color: COLORS.white }}>Cart</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{ marginBottom: 10, paddingHorizontal: 30 }}>
                <View style={{
                    marginTop: 15
                }}>
                    <PhoneIcon size={25} color={COLORS.dark} style={{
                        position: 'absolute',
                        top: 10,
                        zIndex: 999
                    }}></PhoneIcon>
                    <TextInput placeholder='Phone' onChangeText={(value) => setPhone(value)} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35,
                        color: COLORS.black,
                        fontSize: 18
                    }}
                        keyboardType='phone-pad'
                    ></TextInput>
                </View>
            </View>
            <View style={{ marginBottom: 10, paddingHorizontal: 30 }}>
                <View style={{
                    marginTop: 15
                }}>
                    <MapPinIcon size={25} color={COLORS.dark} style={{
                        position: 'absolute',
                        top: 10,
                        zIndex: 999
                    }}></MapPinIcon>
                    <TextInput placeholder='Address' onChangeText={(value) => setAddress(value)} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35,
                        color: COLORS.black,
                        fontSize: 18
                    }}
                        keyboardType='email-address'
                    ></TextInput>
                </View>
            </View>
            <View style={{ marginBottom: 10, paddingHorizontal: 30 }}>
                <View style={{
                    marginTop: 15
                }}>
                    <TextInput placeholder='Note' onChangeText={(value) => setNote(value)} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35,
                        color: COLORS.black,
                        fontSize: 18
                    }}
                    ></TextInput>
                </View>
            </View>
            <ScrollView horizontal={true} contentContainerStyle={style.scrollView}>
                {selectedItems.map((item: any) => (
                    <View key={item.id} style={style.itemContainer}>
                        <Image source={require('../../assets/coffee1.png')} style={style.itemImage} />
                        <Text style={style.itemName}>{item.productName}</Text>
                        <Text style={style.itemSize}>{item.sizeName}</Text>
                        <View style={{ flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-between' }}>
                            <Text style={style.itemPrice}>${item.productPrice}</Text>
                            <Text style={style.itemPrice}>Qty: {item.quantity}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={{ marginHorizontal: 30 }}>
                <PrimaryButton onPress={() => handlePayment()} title="Checkout" />
            </View>

        </SafeAreaView>
    );
};

export default CheckoutScreen;
const style = StyleSheet.create({
    header: {
        paddingVertical: 15,
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
    scrollView: {
        flexDirection: 'row',
        paddingVertical: 10,
        height: 200,
        marginBottom: 10, 
        paddingHorizontal: 10,
    },
    itemContainer: {
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: COLORS.bgBrown,
        borderRadius: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color:COLORS.black
    },
    itemPrice: {
        fontSize: 14,
        color: COLORS.black,
        fontWeight: 'bold',

    },
    itemSize: {
        fontSize: 14,
        color: COLORS.black
    },
    itemImage: {
        width: 100,
        height: 100,
        marginTop:5
    }

});

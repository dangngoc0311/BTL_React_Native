import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Order } from '../../consts/models';
import auth from '@react-native-firebase/auth';
import COLORS from '../../consts/colors';
import { TouchableOpacity } from 'react-native';
import { ArrowLeftCircleIcon } from 'react-native-heroicons/outline';

const OrderListScreen = ({ navigation }: any) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const userId = auth().currentUser?.uid;
    const fetchOrders = async () => {
        const snapshot = await firestore().collection('Orders').where('userId', '==', userId).get();
        const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            totalAmount: doc.data().totalAmount,
            address: doc.data().address,
            phone: doc.data().phone,
            note: doc.data().note,
            orderDate: doc.data().orderDate.toDate(),
        }));
        setOrders(ordersData);
        console.log(ordersData)
    };
    useEffect(() => {
        fetchOrders();
    }, []);

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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 16,color:COLORS.white }}>Order</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                data={orders} keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // <View>
                    //     {/* <Text>Order ID: {item.id}</Text> */}
                    //     <Text >Total Amount: {item.totalAmount}</Text>
                    //     <Text>Order Date: {item.orderDate.toLocaleDateString()}</Text>
                    //     {/* Hiển thị các thông tin khác về đơn hàng */}
                    // </View>
                    <View style={style.cartCard}>
                        <View
                            style={{
                                height: 100,
                                marginLeft: 10,
                                paddingVertical: 20,
                                flex: 1,
                            }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.black }}>{item.phone}</Text>
                            <Text style={{ fontSize: 13, color: COLORS.grey }}>
                                {item.address}
                            </Text>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: COLORS.black }}>${item.totalAmount}</Text>
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
    }
});

export default OrderListScreen;

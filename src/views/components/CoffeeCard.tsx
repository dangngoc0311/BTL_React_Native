import { View, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StarIcon } from 'react-native-heroicons/solid';
import {  ShoppingBagIcon } from 'react-native-heroicons/outline';
import COLORS from '../../consts/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableHighlight } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
export default function CoffeeCard({ item}: any) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    // const [imageUrl, setImageUrl] = useState('');
    // console.log(item.image);
    const { width } = Dimensions.get("window");
    const userId = auth().currentUser?.uid;
    const addToCart =  async(item:any) => {
        try {
            await firestore()
                .collection('Carts')
                .doc(userId)
                .collection('CartItems')
                .add({
                    productId: item.id,
                    quantity: 1,
                    sizeId: '1',
                });
            console.log('Product added to cart');
        } catch (error) {
            console.log('Error adding product to cart:', error);
        }
    };
 
    return (
        <TouchableHighlight
            underlayColor={COLORS.white}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detailscreen', item)}>
            <View
                key={item.id}
                style={{
                    width: width / 2 - COLORS.SPACING * 2,
                    marginBottom: COLORS.SPACING,
                    borderRadius: COLORS.SPACING * 2,
                    overflow: "hidden",
                    backgroundColor: COLORS.light
                }}
            >
                <View

                    style={{
                        padding: COLORS.SPACING,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Product', { item })}
                        style={{
                            height: 150,
                            width: "100%",
                            borderRadius: 30,
                        }}>
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: COLORS.SPACING * 2,
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                right: 0,
                                borderBottomStartRadius: COLORS.SPACING * 3,
                                borderTopEndRadius: COLORS.SPACING * 2,
                                overflow: "hidden",
                                backgroundColor: COLORS.green
                            }}>
                            <View

                                style={{
                                    flexDirection: "row",
                                    padding: COLORS.SPACING - 4,
                                }}>
                                <StarIcon
                                    style={{
                                        marginLeft: COLORS.SPACING / 2,
                                    }}
                                    color={COLORS.primary}
                                    size={COLORS.SPACING * 1.7} />
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        marginLeft: COLORS.SPACING / 2,
                                    }}>
                                    {item.stars}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text
                        numberOfLines={2}
                        style={{
                            color: COLORS.dark2,
                            fontWeight: "600",
                            fontSize: COLORS.SPACING * 1.7,
                            marginTop: COLORS.SPACING,
                        }}>
                        {item.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    color: COLORS.primary,
                                    marginRight: COLORS.SPACING / 2,
                                    fontSize: COLORS.SPACING * 1.6,
                                }}>$
                            </Text>
                            <Text
                                style={{ color: COLORS.dark2, fontSize: COLORS.SPACING * 1.6 }}>
                                {item.price}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => addToCart(item)}
                            style={{
                                backgroundColor: COLORS.primary,
                                padding: COLORS.SPACING / 2,
                                borderRadius: COLORS.SPACING,
                                shadowColor: 'black',
                                shadowRadius: 40,
                                shadowOffset: { width: -20, height: -10 },
                                shadowOpacity: 1,
                            }}
                        >
                            <ShoppingBagIcon
                                size={COLORS.SPACING * 2}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}


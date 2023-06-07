import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    FlatList
} from "react-native";
import React, { useEffect, useState } from "react";
import COLORS from "../../consts/colors";
import {  Category, Product } from "../../consts/models";
import { BellIcon, MagnifyingGlassIcon, MapPinIcon} from "react-native-heroicons/outline";
import CoffeeCard from "../components/CoffeeCard";
import ApiManager from "../components/ApiManager";
import firestore from '@react-native-firebase/firestore';
const avatar = require("../../assets/avatar.png");

const { width } = Dimensions.get("window");

const HomeScreen = () => {
    const [activeCategory, setActiveCategory] = useState('1');
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const fetchCategories = async () => {
        try {
            const categoriesSnapshot = await firestore().collection("Categories").get();
            const categories = categoriesSnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setCategories(categories);
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };
    const fetchProducts = async () => {
        try {
            const productsSnapshot = await firestore().collection("Products").get();
            const products = productsSnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                price: doc.data().price,
                image: doc.data().image,
                des: doc.data().des,
                category_id: doc.data().category_id,
                stars: doc.data().stars
            }));
            setProducts(products);
        } catch (error) {
            console.log('Error fetching Products:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
       fetchProducts()
    }, []);

    return (
        <SafeAreaView style={{
        }}>
            <ScrollView
                style={{
                    padding: COLORS.SPACING,
                    paddingTop:0,
                    backgroundColor:COLORS.white
                }}>
                <View>
                    <Image
                        source={require('../../assets/beansBackground1.png')}
                        style={{
                            height: 120,
                            opacity: 0.2,
                            position: 'absolute',
                            width: '100%',
                            top: 0
                        }} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 12,
                    }}>
                        <Image source={require('../../assets/avatar.png')}
                            style={{
                                borderRadius: 999,
                                height: 36,
                                width: 36
                            }} />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: 8
                        }}>
                            <MapPinIcon size="25" color={COLORS.bgLight} />
                            <Text style={{
                                fontWeight: '700',
                                fontSize: 16,
                                lineHeight: 24,
                                color: COLORS.dark
                            }}>
                                Sóc Sơn, Hà Nội
                            </Text>
                        </View>
                        <BellIcon size="27" color="black" />
                    </View>
                    <View  style={{
                        marginVertical: 20,
                        marginTop: 10,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 999,
                            padding: 4,
                            backgroundColor: '#e6e6e6'
                        }}>
                            <TextInput placeholder='Search' style={{
                                padding: 8,
                                fontWeight: '600',
                                color: 'gray',
                                fontSize: 16,
                                flex: 1
                            }} />
                            <TouchableOpacity
                                style={{ backgroundColor: COLORS.bgLight, padding: 4, borderRadius: 9999, marginRight: 4 }}>
                                <MagnifyingGlassIcon size="25" strokeWidth={2} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* // categories */}
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 20,
                    justifyContent: 'space-between',
                }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categories}
                        keyExtractor={(item) => item.id.toString()}
                        style={{
                            overflow: 'visible'
                        }}
                        renderItem={({ item }) => {
                            let isActive = item.id.toString() == activeCategory.toString();
                            let activeTextClass = isActive ? 'white' : 'gray';
                            return (
                                <TouchableOpacity
                                    onPress={() => setActiveCategory(item.id)}
                                    style={{
                                        backgroundColor: isActive ? COLORS.bgLight : COLORS.light,
                                        padding: 8,
                                        paddingHorizontal: 20,
                                        marginRight: 8,
                                        borderRadius: 30,
                                    }}
                                >
                                    <Text style={{
                                        fontWeight: '700',
                                        color: activeTextClass
                                    }}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />

                </View>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    {products
                        .filter((coffee) => {
                            if (activeCategory === null) {
                                return true;
                            }
                            return coffee.category_id === activeCategory;
                        })
                        .map((coffee) => (
                            <CoffeeCard
                                item={coffee}
                                key={coffee.id}
                            />
                        ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

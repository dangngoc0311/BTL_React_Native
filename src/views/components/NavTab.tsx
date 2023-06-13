import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, StatusBar, Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon as HomeOutline, HeartIcon as HeartOutline, ShoppingBagIcon as BagOutline } from 'react-native-heroicons/outline';
import { HomeIcon as HomeSolid, HeartIcon as HeartSolid, ShoppingBagIcon as BagSolid } from 'react-native-heroicons/solid';
import COLORS from '../../consts/colors';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';
import OnBoardScreen from '../screens/TestScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from 'react-native-splash-screen';
import CheckoutScreen from '../screens/CheckOutScreen';
import OrderListScreen from '../screens/OrderTracking';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
            screenOptions={{contentStyle: { backgroundColor: 'white' }}}
                >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
                <Stack.Screen name="Product" options={{ headerShown: false }} component={DetailScreen} />
                <Stack.Screen name="Checkout" options={{ headerShown: false }} component={CheckoutScreen} />
                <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
                <Stack.Screen name="OrderList" options={{ headerShown: false }} component={OrderListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )

}

function HomeTabs() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused, color, size }) => menuIcons(route, focused),
            tabBarStyle: {
                marginBottom: 20,
                borderRadius: 9999,
                marginHorizontal: 15,
                backgroundColor: COLORS.bgLight,

            },
            tabBarItemStyle: {
                // marginTop: 25,

            }
        })}

        >
            <Tab.Screen name="home" component={HomeScreen} />
            <Tab.Screen name="favourite" component={HomeScreen} />
            <Tab.Screen name="orderlist" component={OrderListScreen} />
        </Tab.Navigator>
    )
}

const menuIcons = (route:any, focused:any) => {
    let icon;


    if (route.name === 'home') {
        icon = focused ? <HomeSolid size="25" color={COLORS.bgLight} /> : <HomeOutline size="25" strokeWidth={2} color="white" />
    } else if (route.name === 'favourite') {
        icon = focused ? <HeartSolid size="25" color={COLORS.bgLight} /> : <HeartOutline size="25" strokeWidth={2} color="white" />
    } else if (route.name === 'orderlist') {
        icon = focused ? <BagSolid size="25" color={COLORS.bgLight} /> : <BagOutline size="25" strokeWidth={2} color="white" />
    }


    let buttonClass = focused ? "white" : "";
    return (
        <View style={{
            alignItems: 'center',
            borderRadius: 9999,
            padding: 12,
            flex: 1,
            backgroundColor: buttonClass
        }}>
            {icon}
        </View>
    )
}
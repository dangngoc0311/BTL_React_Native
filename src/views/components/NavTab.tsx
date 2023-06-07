import React from 'react'
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <Stack.Navigator screenOptions={{
                contentStyle: { backgroundColor: 'white' }
            }}>
                <Stack.Screen name="BoardScreen" component={OnBoardScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
                <Stack.Screen name="Product" options={{ headerShown: false }} component={DetailScreen} />
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
            <Tab.Screen name="cart" component={CartScreen} />
        </Tab.Navigator>
    )
}

const menuIcons = (route:any, focused:any) => {
    let icon;


    if (route.name === 'home') {
        icon = focused ? <HomeSolid size="25" color={COLORS.bgLight} /> : <HomeOutline size="25" strokeWidth={2} color="white" />
    } else if (route.name === 'favourite') {
        icon = focused ? <HeartSolid size="25" color={COLORS.bgLight} /> : <HeartOutline size="25" strokeWidth={2} color="white" />
    } else if (route.name === 'cart') {
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
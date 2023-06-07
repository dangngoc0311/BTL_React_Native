import { Pressable, StyleSheet, Text, View } from "react-native";
import COLORS from "../../consts/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { PrimaryButton } from "../components/Button";

const OnBoardScreen = ({ navigation }:any) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bgBrown }}>
            <View style={{ height: 400 }}>
                <Image
                    style={{
                        width: '100%',
                        resizeMode: 'contain',
                        top: 0,
                    }}
                    source={require('../../assets/onboard.png')}
                />
            </View>
            <View style={style.textContainer}>
                <View>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
                        Delicious Food
                    </Text>
                    <Text
                        style={{
                            marginTop: 20,
                            fontSize: 18,
                            textAlign: 'center',
                            color: COLORS.grey,
                        }}>
                        We help you to find best and delicious food
                    </Text>
                </View>
                <View style={style.indicatorContainer}>
                    <View style={style.currentIndicator} />
                    <View style={style.indicator} />
                    <View style={style.indicator} />
                </View>
                <PrimaryButton
                    onPress={() => navigation.navigate("Signup")}
                    title="Get Started"
                />
                <Pressable
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 4
                    }}>Login</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    textContainer: {
        flex: 1,
        paddingHorizontal: 50,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    indicatorContainer: {
        height: 50,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentIndicator: {
        height: 12,
        width: 30,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
    },
    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: COLORS.grey,
        marginHorizontal: 5,
    },
});

export default OnBoardScreen;
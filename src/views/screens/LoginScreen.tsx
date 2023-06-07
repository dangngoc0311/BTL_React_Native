import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../consts/colors';
import { View, TextInput, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { Text } from 'react-native';
import { EyeDropperIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from 'react-native-heroicons/solid';
import CheckBox from '@react-native-community/checkbox';
import { PrimaryButton } from '../components/Button';
import { PhoneIcon } from 'react-native-heroicons/outline';
import auth from '@react-native-firebase/auth';


// import firebase from 'react-native-firebase'

const LoginScreen = ({ navigation }: any) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const loginSubmit = () => {
        var formData = {
            email: email,
            password: password
        }
        console.log(formData)
        // formData.password === '' ? setErrPassword('Password khoong ddee trong') : setErrPassword('');
        // ApiManager.post('users/login', formData,
        //     {
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //     }).then((res) => {
        //         console.log(res.data)
        //         if (res.data==null) {
        //             Alert.alert(`Check phone number and password`);
        //         }else{
        //             Alert.alert("Login successfully");
        //             navigation.navigate('Home');
        //         }
        //     }
        //     ).catch((err =>
        //         console.log(err)
        //     ));
        auth().signInWithEmailAndPassword(formData.email, formData.password).then(() => navigation.navigate('Home')).catch(error=>Alert.alert(`Check phone number and password`));
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, padding: 30 }}>
            <View style={{ marginTop: 30, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'black' }}> Login</Text>
            </View>
            <View style={{ marginTop: 30, paddingHorizontal:10 }}>
                <View style={{
                    marginTop: 15
                }}>
                    <PhoneIcon size={25} color={COLORS.dark} style={{
                        position: 'absolute',
                        top: 10,
                        zIndex: 999
                    }}></PhoneIcon>
                    <TextInput placeholder='Email' onChangeText={(value) => setEmail(value)} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35
                    }}
                        keyboardType='email-address'
                    ></TextInput>
                </View>
                <View style={{
                    marginTop: 15
                }}>
                    <LockClosedIcon size={25} color={COLORS.dark} style={{
                        position: 'absolute',
                        top: 10,
                        zIndex: 999
                    }}></LockClosedIcon>
                    <TextInput placeholder='Password' secureTextEntry={isPasswordShown} onChangeText={(value) => setPassword(value)} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35
                    }}></TextInput>
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={{
                            position: "absolute",
                            right: 5,
                            bottom:10
                        }}
                    >
                        {
                            isPasswordShown == true ? (
                                <EyeSlashIcon size={24} color={COLORS.black} />
                            ) : (
                                <EyeIcon size={24} color={COLORS.black} />
                            )
                        }

                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems:'center',
                    marginBottom:30
                    ,marginTop:15
                }}>
                    <CheckBox disabled={false} value={isChecked} onValueChange={() => setIsChecked(!isChecked)} tintColors={{ true: COLORS.bgLight }}></CheckBox>
                    <Text>Remember me</Text>
                </View>
            </View>
            <PrimaryButton onPress={() => loginSubmit()}
                title="Login"
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 22
            }}>
                <Text style={{ fontSize: 16, color: COLORS.black }}>Don't have an account ? </Text>
                <Pressable
                    onPress={() => navigation.navigate("Signup")}>
                    <Text style={{
                        fontSize: 16,
                        color: COLORS.primary,
                        fontWeight: "bold",
                        marginLeft: 6
                    }}>Singup</Text>
                </Pressable>
            </View>
            <View>
                <View style={{ height: 200 }}>
                    <Image
                        style={{
                            width: '100%',
                            resizeMode: 'contain',
                            top: -70,
                        }}
                        source={require('../../assets/onboard.png')}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen;
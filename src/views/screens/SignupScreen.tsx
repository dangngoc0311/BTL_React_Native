import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../consts/colors';
import { EyeDropperIcon, EyeIcon, EyeSlashIcon, InboxIcon, LockClosedIcon, PhoneIcon, UserIcon } from 'react-native-heroicons/solid';
import CheckBox from '@react-native-community/checkbox';
import { PrimaryButton } from '../components/Button';
import auth from '@react-native-firebase/auth';



const SignupScreen = ({ navigation }: any) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errPassword, setErrPassword] = useState('');
    // const signUpSubmit = () => {
    //     var formData = {
    //         fullName: fullName,
    //         phoneNumber: phoneNumber,
    //         password: password
    //     }
    //     console.log(formData)
    //     // formData.password === '' ? setErrPassword('Password khoong ddee trong') : setErrPassword('');
    //     ApiManager.post('users', formData,
    //         {
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //         }).then((res) =>{
    //         console.log(res)
    //         if (res.data) {
    //             Alert.alert(`DANG KY THANH CONG VOI ${formData.phoneNumber}`);
    //             navigation.navigate('Login');
    //         }
    //     }
    //     ).catch((err => 
    //         console.log(err)
    //     ))
    // }
    const signUpSubmit = () => {
        var formData = {
            email: email,
            password: password
        }
        console.log(formData)
        auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, padding: 30 }}>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'black' }}> Signup</Text>
            </View>
            <View style={{ marginTop: 30, paddingHorizontal: 10 }}>
                <View style={{
                    marginTop: 15
                }}>
                    <InboxIcon size={25} color={COLORS.dark} style={{
                        position: 'absolute',
                        top: 10,
                        zIndex: 999
                    }}></InboxIcon>
                    <TextInput placeholder='Email' onChangeText={(value) => setEmail(value)} keyboardType='email-address' style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35,
                        color: COLORS.black,
                        fontSize: 18
                    }}

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
                    <TextInput placeholder='Password' onChangeText={(value) => setPassword(value)} secureTextEntry={isPasswordShown} style={{
                        borderBottomWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: COLORS.grey,
                        paddingLeft: 35, 
                        color: COLORS.black,
                        fontSize: 18
                    }}></TextInput>
                    <Text style={{ color: 'red', fontSize:16 }}>{errPassword}</Text>
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={{
                            position: "absolute",
                            right: 5,
                            bottom: 28
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
                    alignItems: 'center',
                    marginBottom: 30
                    , marginTop: 15
                }}>
                    <CheckBox disabled={false} value={isChecked} onValueChange={() => setIsChecked(!isChecked)} tintColors={{ true: COLORS.bgLight }}></CheckBox>
                    <Text style={{ color: COLORS.black, fontSize: 16 }}>I aggree to the terms and conditions</Text>
                </View>
            </View>
            <PrimaryButton onPress={() => signUpSubmit()}
                title="Signup"
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 22
            }}>
                <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account ? </Text>
                <Pressable
                    onPress={() => navigation.navigate("Login")}>
                    <Text style={{
                        fontSize: 16,
                        color: COLORS.primary,
                        fontWeight: "bold",
                        marginLeft: 6
                    }}>Login</Text>
                </Pressable>
            </View>
            {/* <View>
                <View style={{ height: 200 }}>
                    <Image
                        style={{
                            width: '100%',
                            resizeMode: 'contain',
                            top: -100,
                            position: 'absolute'
                        }}
                        source={require('../../assets/onboard.png')}
                    />
                </View>
            </View> */}
        </SafeAreaView>
    )
}

export default SignupScreen;
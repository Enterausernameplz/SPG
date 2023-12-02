import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(()=>{
    setLoading(true);
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
        setLoading(false);
    });

    return unsubscribe;
  },[])

  const login =() =>{
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredntial)=>{
        const user = userCredntial.user;
        Alert.alert("로그인 완료", "로그인에 성공했습니다.", [
            { text: "OK", onPress: () => navigation.replace("Home") }
          ]);
        })
    .catch((error)=>{
        setLoading(false);
        Alert.alert("로그인 오류",error.message); 
    })
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        padding: 10,
      }}
    >
        {loading ? (
            <View style={{alignItems: "center", justifyContent:"center", flexDirection:"row"}} >
                <Text style={{marginRight:10}}>Loading</Text>
                <ActivityIndicator size="large" color={"red"}/>
            </View>
        ) :(
            <KeyboardAvoidingView>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 100,
              }}
            >
              <Text style={{ fontSize: 20, color: "#662d91", fontWeight: "bold" }}>
                Sign In
              </Text>
              <Text style={{ fontSize: 18, marginTop: 8, fontWeight: "600" }}>
                계정에 로그인하세요
              </Text>
            </View>
            <View style={{ marginTop: 50 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="black"
                />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholderTextColor="gray"
                  style={{
                    fontSize: email ? 18 : 18,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    marginLeft: 13,
                    width: 300,
                    marginVertical: 10,
                  }}
                />
              </View>
    
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="key-outline" size={24} color="black" />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  placeholderTextColor="gray"
                  style={{
                    fontSize: password ? 18 : 18,
                    borderBottomWidth: 1,
                    borderBottomColor: "gray",
                    marginLeft: 13,
                    width: 300,
                    marginVertical: 20,
                  }}
                />
              </View>
    
              <Pressable
              onPress={login}
                style={{
                  width: 200,
                  backgroundColor: "#318CE7",
                  padding: 15,
                  borderRadius: 7,
                  marginTop: 50,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text style={{ fontSize: 18, textAlign: "center", color: "white" }}>
                  로그인
                </Text>
              </Pressable>
    
              <Pressable onPress={()=>navigation.navigate("Register")} style={{ marginTop: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    color: "gray",
                    fontWeight: "500",
                  }}
                >
                  계정 등록
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        )}

    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});

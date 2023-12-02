import {
    Alert,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
  import { auth, db } from "../firebase";
  import { doc, setDoc } from "firebase/firestore";
  
  const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const register = () => {
      if (name === "" || email === "" || password === "") {
        Alert.alert(
          "Invalid Details",
          "모든 항목을 채워주세요",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // 디스플레이네임
          return updateProfile(userCredential.user, {
            displayName: name,
          });
        })
        .then(() => {
          // 사용자 정보 저장
          const user = auth.currentUser;
          return setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: name,
          });
        })
        .then(() => {
          Alert.alert("등록 완료", "로그인하세요");
          navigation.navigate("Login");
          
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    };
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          padding: 10,
        }}
      >
        <KeyboardAvoidingView>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Text style={{ fontSize: 20, color: "#662d91", fontWeight: "bold" }}>
              Register
            </Text>
            <Text style={{ fontSize: 18, marginTop: 8, fontWeight: "600" }}>
              계정을 등록하세요
            </Text>
          </View>
  
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="person-outline" size={24} color="black" />
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholderTextColor="gray"
                style={{
                  fontSize: name ? 18 : 18,
                  borderBottomWidth: 1,
                  borderBottomColor: "gray",
                  marginLeft: 13,
                  width: 300,
                  marginVertical: 20,
                }}
              />
            </View>
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
              onPress={register}
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
                계정 등록
              </Text>
            </Pressable>
  
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  color: "gray",
                  fontWeight: "500",
                }}
              >
                이미 계정이 있다면 로그인하세요
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});
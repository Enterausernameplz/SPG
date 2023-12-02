import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import QuizScreen from "./QuizScreen";
import { auth } from "../firebase";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user,setUser]=useState(null);
  const [image, setImage] = useState(null);
  const [ loggedInUser,setLoggedInUser] = useState(null);

  useEffect(() => {
    // 사용자 상태 감시자 설정
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser({
            name: user.displayName,
            email: user.email,
            uid : user.uid,
            photoURL:user.photoURL,
          });
      } else {
        setLoggedInUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity>
          <AntDesign name="setting" size={35} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Image
            source={{
              uri: loggedInUser && loggedInUser.photoURL ? loggedInUser.photoURL :"https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 50,
              marginBottom: 5,
            }}
          />
          <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>
            {loggedInUser && loggedInUser.name ? loggedInUser.name : "User"}       
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: "darkgray",
              fontWeight: "500",
            }}
          >
            {loggedInUser && loggedInUser.email ? loggedInUser.email : "Email"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 25,
          }}
        >
          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
              Clicks
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              클릭횟수
            </Text>
          </View>

          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
              Shares
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              공유횟수
            </Text>
          </View>

          <View style={{ alignItems: "center ", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 16, color: "black", justifyContent: "center" }}
            >
              Clicks
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "darkgray",
                fontWeight: 700,
              }}
            >
              클릭횟수
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "skyblue",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate("Quiz")} 
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            SGP Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});

//xs 10 sm 15 smedium 18 medium 20 large 30 safe 55

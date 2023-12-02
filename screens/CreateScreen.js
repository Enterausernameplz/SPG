import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { DocumentReference, } from "firebase/firestore";
import { auth } from "../firebase";
import { doc, addDoc,getFirestore ,collection  } from "firebase/firestore"; 

const CreateScreen = () => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [ loggedInUser,setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // Firestore 인스턴스 초기화
  const db = getFirestore();

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

  // 이미지 선택 함수
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera roll permissions are required to select an image"
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log("Selected image URI: ", result.assets[0].uri); 
    }
  };

  // 게시물 업로드 함수
  const handlePost = async () => {
    setLoading(true);
    if (!postText && !image) {
      Alert.alert("빈 게시물입니다", "내용을 입력해주세요.");
      setLoading(false); 
      return;
    }


 
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Authentication Error", "Please log in to post.");
        setLoading(false);
        return;
      }
 
      // Firestore에 새 게시물 추가
      const newPost = {
        text: postText,
        image: image,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        userProfileImage: user.photoURL || "https://cdn-icons-png.flaticon.com/128/149/149071.png",
        likesCount: 0,
        likedByUsers: [], 
        userName: user.displayName || "User", 
      };
      const docRef = await addDoc(collection(db,'posts'),newPost)
      const newPostWithId = {... newPost, id:docRef.id}
      setPostText("");
      setImage(null);
      setLoading(false);
      navigation.navigate("Community",{ loggedInUser: loggedInUser, newPost: newPostWithId });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Error saving post: " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: loggedInUser && loggedInUser.photoURL ? loggedInUser.photoURL :"https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>{loggedInUser && loggedInUser.name ? loggedInUser.name : "User"}</Text>
      </View>
      <TextInput
        placeholder="문구를 입력하세요..."
        multiline
        value={postText}
        onChangeText={setPostText}
        style={{
          width: "100%",
          height: 100,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <Feather name="camera" size={24} color="black" />
        </TouchableOpacity>
        {image && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, borderRadius: 10 }}
            />
          </View>
        )}
        <TouchableOpacity onPress={handlePost}>
          <Text style={{ color: "skyblue", fontSize: 18 }}>게시물 공유</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateScreen;

// 스타일 정의는 필요에 따라 여기에 추가하세요.
const styles = StyleSheet.create({});

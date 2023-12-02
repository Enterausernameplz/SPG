// NewsDetailScreen.js
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Image, Share, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';

const NewsScreen = () => {
  const route = useRoute();
  const { item } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
  }, []);

  const shareNews =() =>{
        Share.share({
            message: `${item.title}\n\n${item.description}\n\nRead more: ${item.urlToImage}`,
        })
  }

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingStart: 10,
          paddingEnd: 10,
          marginTop: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>shareNews()}>
          <Feather name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Image 
          source={{ uri: item.urlToImage }}
          style={{ width: "100%", height: 250, borderRadius: 15 }}
        />
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 22,
          fontWeight: "bold",
          paddingStart: 10,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          marginTop: 10,
          color: "skyblue",
          fontSize: 16,
          fontWeight: "bold",
          paddingStart: 10,
        }}
      >
        {item.source.name}
      </Text>
      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          color: "gray",
          lineHeight: 30,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {item.description}
      </Text>
      <TouchableOpacity onPress={()=>WebBrowser.openBrowserAsync(item.url)}>
        <Text
          style={{
            marginTop: 10,
            color: "skyblue",
            fontSize: 16,
            fontWeight: "bold",
            paddingStart: 10,
          }}
        >
          더보기
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewsScreen;

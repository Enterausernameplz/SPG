import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const HeadlineList = ({ newsList }) => {
  const navigation = useNavigation();
  return (
    <View>
      <FlatList
      style={{paddingLeft:10,paddingRight:10}}
        data={newsList}
        renderItem={({ item }) => (
          <View>
            <View
              style={{
                height: 1,
                backgroundColor: "lightgray",
                marginTop: 10,
                marginLeft: -30,
              }}
            ></View>

            <TouchableOpacity
              onPress={() => navigation.navigate("NewsDetail" ,{item:item})}
              style={{ marginTop: 15, display: "flex", flexDirection: "row" }}
            >
              <Image
                source={{ uri: item.urlToImage }}
                style={{ width: 130, height: 130, borderRadius: 10,}}
              />
              <View style={{ marginRight: 135, marginLeft: 10 }}>
                <Text
                  numberOfLines={4}
                  style={{ fontSize: 18, fontWeight: "bold" }}
                >
                  {item.title}
                </Text>
                <Text sytle={{ color: "skyblue", marginTop: 6 }}>
                  {item?.source?.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HeadlineList;

const styles = StyleSheet.create({});

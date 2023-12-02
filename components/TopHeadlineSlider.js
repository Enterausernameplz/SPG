import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../data/GlobalApi";
import { useNavigation } from "@react-navigation/native";


const TopHeadlineSlider = () => {
  const [newsList, setNewsList] = useState([]);
  useEffect(() => {
    getTopHeadline();
  }, []);

  const getTopHeadline = async () => {
    const result = (await GlobalApi.getTopHeadline).data;
    setNewsList(result.articles);
  };
  const navigation = useNavigation();
  return (
    <View style={{ marginTop: 15 }}>
      <FlatList       
        data={newsList}
        horizontal
        showsHorizontalScrollIndicator={true}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("NewsDetail",{item:item})}
            style={{
              width: Dimensions.get("screen").width * 0.83,
              marginLeft: 15,
            }}
          >
            <Image
              source={{ uri: item.urlToImage }}
              style={{
                height: 200,
                borderRadius: 10,
              }}
            />
            <Text
              numberOfLines={3}
              style={{ marginTop: 10, fontSize: 23, fontWeight: "900" }}
            >
              {item.title}
            </Text>
            <Text style={{ marginTop: 5, color: "skyblue",  }}>
              {item?.source?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TopHeadlineSlider;

const styles = StyleSheet.create({});

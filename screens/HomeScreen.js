import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    StatusBar,
    TextInput,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import CategoryTextSlider from "../components/CategoryTextSlider";
  import { Ionicons } from "@expo/vector-icons";
  import TopHeadlineSlider from "../components/TopHeadlineSlider";
  import HeadlineList from "../components/HeadlineList";
  import GlobalApi from "../data/GlobalApi";

  
  
  const HomeScreen = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading,setLoading] = useState(true);
  
    useEffect(() => {
      getTopHeadline();
    }, []);
  
    const getTopHeadline = async () => {
      setLoading(true);
      const result = (await GlobalApi.getTopHeadline).data;
      setNewsList(result.articles);
      setLoading(false);
    };
    return (
      
        <SafeAreaView style={styles.container}>
          {loading?<ActivityIndicator size={'large'} color={'skyblue'}/>:<View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "skyblue",paddingLeft:10,paddingRight:10 }}>
              SPG NEWS
            </Text>
            <Ionicons name="notifications-outline" size={25} color="black" />
          </View>
  
          {/* Category List */}
          <CategoryTextSlider />
  
          {/* Top Headline Slider */}
          <TopHeadlineSlider newsList={newsList} />
  
          {/*Headline List*/}
          <HeadlineList newsList={newsList} />
          </View>
        }
        
      </SafeAreaView>
    );
  };
  
  export default HomeScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: 20,
      padding: 20,
    },
  });
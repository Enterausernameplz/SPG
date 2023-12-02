import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

const CategoryTextSlider = () => {
  const [active, setActive] = useState(1);
  const categoryList = [
    {
      id: 1,
      name: "Latest",
    },
    {
      id: 2,
      name: "Team",
    },
    {
      id: 3,
      name: "Trade",
    },
    {
      id: 4,
      name: "Issue",
    },
  ];

  const onCategoryClick=(id)=>{
    setActive(id)
  }
  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=> onCategoryClick(item.id)}>
            <Text
              style={
                item.id == active ? styles.selectText : styles.unselectText 
              }
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryTextSlider;

const styles = StyleSheet.create({
  unselectText: {
    marginRight: 15,
    fontSize: 20,
    fontWeight: "800",
    color: "gray",
    paddingLeft:20,

  },
  selectText: {
    marginRight: 15,
    fontSize: 20,
    fontWeight: "900",
    color: "black",
    paddingLeft :23,

  },
});

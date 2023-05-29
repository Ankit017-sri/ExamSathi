import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import QuesCard from "./QuesCard";

const PAGE_SIZE = 2;

const Pagination = ({
  data,
  onSelect,
  page,
  selected,
  setSelected,
  scrollList,
}) => {
  const [items, setItems] = useState([]);

  const fetchData = () => {
    // console.log(data);
    const startIndex = page * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const newItems = data.slice(startIndex, endIndex);
    setItems(newItems);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const renderItem = ({ item }, index) => (
    <QuesCard
      data={item}
      index={index}
      onSelect={onSelect}
      selected={selected}
      setSelected={setSelected}
    />
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.qNo.toString()}
      // onEndReached={handleEndReached}
      // onEndReachedThreshold={0.5}
      ref={scrollList}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default Pagination;

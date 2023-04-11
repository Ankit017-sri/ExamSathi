import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";

const NewGroup = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [newGroup, setNewGroup] = useState([]);
  const [refArray, setRefArray] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({});

      if (data.length > 0) {
        // Use the retrieved data for creating groups
        setContacts(data);
        let refArray = Array(data.length + 1).fill(-1);
        setRefArray(refArray);
      }
    }
  };

  const addToGroup = ({ id, name, phoneNumber, image }) => {
    const found = newGroup.find((value) => value.id === id);
    if (found) {
      removeFromGroup({ id: id });
    } else {
      setNewGroup([
        ...newGroup,
        { id: id, name: name, phoneNumber: phoneNumber, image: image },
      ]);
      refArray[id] = id;
    }
  };

  const removeFromGroup = ({ id }) => {
    const group = newGroup.filter((value) => value.id !== id);
    setNewGroup(group);
    refArray[id] = -1;
  };

  useEffect(() => {
    getContacts();
  }, []);

  const AddedContacts = ({ contact }) => {
    return (
      <View style={{ marginRight: 10 }} key={contact.id}>
        <View style={{ position: "relative", alignSelf: "center" }}>
          {contact.image ? (
            <Image source={{ uri: contact.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="person" size={25} />
            </View>
          )}
          <Pressable
            style={{
              position: "absolute",
              right: -5,
              top: 10,
              zIndex: 20,
              backgroundColor: "white",
              borderRadius: 20,
            }}
            onPress={() => removeFromGroup({ id: contact.id })}
          >
            <Ionicons name="close-circle" size={20} />
          </Pressable>
        </View>
        <Text style={{ color: "black" }}>
          {contact.name !== "undefined "
            ? contact.name
            : contact.phoneNumber.split(" ")[1] +
              contact.phoneNumber.split(" ")[2]}
        </Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title={"New Group"}
        sub={"Add participants"}
        isBack
        navigation={navigation}
      />
      <ScrollView style={{ paddingVertical: 8, paddingHorizontal: 20 }}>
        {newGroup.length > 0 && (
          <FlatList
            data={newGroup}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AddedContacts contact={item} />}
            horizontal
            style={{
              flexDirection: "row",
              borderBottomColor: "black",
              borderBottomWidth: 1,
              marginBottom: 20,
              paddingVertical: 10,
            }}
          />
        )}
        {contacts.map((contact, index) => {
          return (
            <Pressable
              key={index}
              onPress={() =>
                addToGroup({
                  id: contact.id,
                  name:
                    contact.firstName +
                    " " +
                    (contact.lastName ? contact.lastName : ""),
                  phoneNumber: contact.phoneNumbers[0].number,
                  image: contact.imageAvailable && contact.image.uri,
                })
              }
              style={{ marginBottom: 20, position: "relative" }}
            >
              <View style={styles.contact}>
                {contact.imageAvailable ? (
                  <Image
                    source={{ uri: contact.image.uri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={25} />
                  </View>
                )}
                {(contact.firstName || contact.lastName) && (
                  <Text style={styles.name}>
                    {contact.firstName} {contact.lastName}
                  </Text>
                )}
                {!contact.firstName && !contact.lastName && (
                  <Text style={styles.name}>
                    {contact.phoneNumbers[0].number}
                  </Text>
                )}
              </View>
              {refArray[contact.id] == contact.id && (
                <View style={{ position: "absolute", right: 10, top: 5 }}>
                  <Ionicons name="checkmark" size={30} color={"#17cfe3"} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          backgroundColor: "#17cfe3",
          height: 50,
          width: 50,
          borderRadius: 40,
          zIndex: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => console.log(newGroup)}
      >
        <Ionicons name="arrow-forward-outline" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default NewGroup;

const styles = StyleSheet.create({
  contact: {
    flexDirection: "row",
  },
  name: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 25,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#17cfe3",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },
});

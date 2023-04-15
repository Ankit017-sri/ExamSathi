import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import ChatContext from "../chat/context";
import AuthContext from "../auth/context";
import io from "socket.io-client";
import axios from "axios";
import baseUrl from "../baseUrl";

const NewGroup = ({ navigation }) => {
  const { handleGroup, groups } = useContext(ChatContext);
  const { token, name, phone, setTabBarVisible } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [newGroup, setNewGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [refArray, setRefArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleCreate = async () => {
    // console.log(groupName, newGroup);
    if (newGroup.length < 1) {
      return Alert.alert("Group", "please add atleast one member!");
    }
    hideModal();
    let found = groups.find((item) => item.groupName === groupName);
    // console.log(found);
    if (found) {
      Alert.alert("Group name", "Group name already exists!");
    } else {
      const phoneNumbers = newGroup.map((item) => {
        return item.phoneNumber.split(" ")[1] + item.phoneNumber.split(" ")[2];
      });
      phoneNumbers.push(`${phone}`);
      console.log("phonenumbers ", phoneNumbers);
      const res = await axios
        .post(
          `${baseUrl}/group/new`,
          { name: groupName, phoneNumbers: phoneNumbers },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((e) => console.log(e));
      console.log(res.data);
      if (res.data) {
        handleGroup(res.data);
        setNewGroup([]);
        setGroupName("");
        navigation.navigate("Chat Groups");
      } else {
        Alert.alert("Group not created", "something went wrong!");
      }
    }
  };

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
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Pressable onPress={hideModal} style={{ alignSelf: "flex-end" }}>
              <Ionicons name="close" size={30} />
            </Pressable>
            <Text style={styles.modalText}>Group name</Text>
            <TextInput
              placeholder=" Enter group name "
              style={{
                borderColor: "grey",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
                height: 40,
                minWidth: "90%",
              }}
              onChangeText={(text) => setGroupName(text)}
            />
            <Pressable
              onPress={handleCreate}
              style={{
                marginTop: 20,
                justifyContent: "center",
                backgroundColor: "#17cfe3",
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1,
                padding: 8,
              }}
            >
              <Text
                style={{ fontWeight: "600", fontSize: 16, alignSelf: "center" }}
              >
                Create
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
        onPress={showModal}
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
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: 30,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 10,
  },
  content: {
    backgroundColor: "#fff",
    elevation: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});

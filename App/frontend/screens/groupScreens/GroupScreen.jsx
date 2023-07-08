import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import GroupDetails from "../GroupDetails";
import CustomHeader from "../../components/CustomHeader";
import cache from "../../utilities/cache";
import { useNavigation } from "@react-navigation/native";
import { Mixpanel } from "mixpanel-react-native";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(
  "fcab386593bfcae67eaafb8136754929",
  trackAutomaticEvents
);

mixpanel.init();
const Group = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
  ]);
  const [selectedGroup, setselectedGroup] = useState("discussion");
  const [userData, setUserData] = useState({});
  const listViewRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [currTab, setCurrTab] = useState("सराव अड्डा");
  let limit = 5;
  let groupsRequest = new CometChat.GroupsRequestBuilder()
    .setLimit(limit)
    .build();

  const restoreUser = async () => {
    const data = await cache.get("user");
    // console.log("aaaa", data);
    setUserData({
      userId: data?._id,
      userName: data?.fullName,
      userMobile: data?.phoneNumber,
    });
  };

  useEffect(() => {
    restoreUser();
  }, []);
  useEffect(() => {
    groupsRequest.fetchNext().then(
      (groupList) => {
        console.log("Groups list fetched successfully", groupList);
        setGroups(groupList);
      },
      (error) => {
        console.log("Groups list fetching failed with error", error);
      }
    );
  }, [userData]);

  useEffect(() => {
    listViewRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, [index]);

  const joingroup = (groupid) => {
    var GUID = groupid;
    var password = "";
    var groupType = CometChat.GROUP_TYPE.PUBLIC;

    CometChat.joinGroup(GUID, groupType, password).then(
      (group) => {
        console.log("Group joined successfully:", group);
      },
      (error) => {
        // console.log("Group joining failed with exception:", error);
      }
    );
  };
  const unReadMsg = (uid) => {
    let UID = "uuu";

    CometChat.getUnreadMessageCountForUser(UID).then(
      (array) => {
        console.log("Message count fetched", array);
      },
      (error) => {
        console.log("Error in getting message count", error);
      }
    );
  };

  useEffect(() => {
    mixpanel.timeEvent(`time_spent_on_${currTab}_tab`);

    return () => {
      mixpanel
        .eventElapsedTime(`time_spent_on_${currTab}_tab`)
        .then((duration) => {
          mixpanel.track(`time_spent_on_${currTab}_tab`, {
            duration: `${duration + " second"}`,
          });
          mixpanel.clearSuperProperties(`time_spent_on_${currTab}_tab`);
        })
        .catch((error) => {
          console.error("Error calculating screen time:", error);
        });
    };
  }, [currTab]);

  const GroupList = ({ item, index: findex }) => {
    joingroup(userData?.userId);
    // unReadMsg(item.guid)
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setCurrTab(item?.name),
              setselectedGroup(item.guid),
              setIndex(findex);
          }}
          style={{
            width: 95,
            height: 50,
            margin: 5,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 35, height: 35, resizeMode: "contain" }}
            source={{ uri: item?.icon }}
          />
          {/* <Image style={{ width: 30, height: 30, resizeMode: 'contain', marginTop: 2 }} source={require('../assets/images/books.png')} /> */}
          <Text
            style={{
              fontWeight: "600",
              marginVertical: 5,
              fontSize: 13,
              color: "#fff",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
        {findex === index ? (
          <View style={{ backgroundColor: "#3696FF", width: 50, height: 5 }} />
        ) : null}
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View
        style={{
          // padding: 15,
          width: "100%",
          backgroundColor: "#084347",
          height: 155,
        }}
      >
        <CustomHeader
          title="ExamSathi"
          share
          navigation={navigation}
          // sub={`${memCount} members, ${len} online`}
        />
        {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, alignItems: 'center', marginTop: 18 }}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>Exam Sathi</Text>
          <View style={{ backgroundColor: '#2AC503', borderRadius: 10, flexDirection: 'row', alignItems: 'center', pending: 5 }}>
            <Text style={{ fontSize: 12 }}> मित्र आमंत्रित करा </Text>
            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginHorizontal: 5 }} source={require('../../assets/images/whatsapp.png')} />
          </View>
          <View style={{ alignItems: 'center', width: 20, height: 20, borderRadius: 10, borderColor: '#fff', borderWidth: 1 }}>
            <Image style={{ width: 15, height: 15, resizeMode: 'contain', marginHorizontal: 5 }} source={require('../../assets/images/person.png')} />
          </View>
        </View> */}
        <FlatList
          ref={listViewRef}
          initialScrollIndex={index}
          style={{ marginTop: 10 }}
          horizontal={true}
          data={groups}
          renderItem={GroupList}
          // scrollToIndex={({
          //   index,animated:true,viewPosition:0.5
          // })}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {console.log("print select", selectedGroup)}
      {selectedGroup === "daily_revision" ? (
        <GroupDetails guid={selectedGroup} />
      ) : selectedGroup === "discussion" ? (
        <GroupDetails guid={selectedGroup} />
      ) : selectedGroup === "doubt_group" ? (
        <GroupDetails guid={"doubt_group"} />
      ) : selectedGroup === "motivation" ? (
        <GroupDetails guid={selectedGroup} />
      ) : (
        <GroupDetails guid={selectedGroup} />
      )}
    </View>
  );
};

export default Group;

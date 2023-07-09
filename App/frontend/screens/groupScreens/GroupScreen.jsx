import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useRef, useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from "react-native";
import { Mixpanel } from "mixpanel-react-native";

import GroupDetails from "../GroupDetails";
import MediaViewer from "../../components/MediaViewer";
import AuthContext from "../../auth/context";
import CustomHeader from "../../components/CustomHeader";

const trackAutomaticEvents = true;
const mixpanel = new Mixpanel(
  "fcab386593bfcae67eaafb8136754929",
  trackAutomaticEvents
);

mixpanel.init();

const Group = () => {
  const [groups, setGroups] = useState([
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
    { name: "yash" },
  ]);
  const [selectedGroup, setselectedGroup] = useState("daily_revision");
  const [index, setIndex] = useState(0);
  const [isShowingMedia, setIsShowingMedia] = useState(false);
  const [mediaDetails, setMediaDetails] = useState({ url: "", type: "" });
  const [currTab, setCurrTab] = useState("सराव अड्डा");

  const listViewRef = useRef(null);

  const { setTabBarVisible } = useContext(AuthContext);

  let limit = 5;
  let groupsRequest = new CometChat.GroupsRequestBuilder()
    .setLimit(limit)
    .build();

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
  }, []);

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
    let UID = uid;

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
    const backAction = () => {
      if (isShowingMedia) {
        setIsShowingMedia(false);
        setTabBarVisible(true);
        return true;
      } else return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isShowingMedia]);

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
    joingroup(item.guid);
    // unReadMsg(item.guid);
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setCurrTab(item?.name);
            setselectedGroup(item.guid);
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
          {/* <Image style={{ width: 30, height: 30, resizeMode: 'contain', marginTop: 2 }} source={require('../../assets/images/books.png')} /> */}
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
          width: "100%",
          backgroundColor: "#084347",
          // height: 155,
        }}
      >
        <CustomHeader title="ExamSathi" share />
        <FlatList
          ref={listViewRef}
          initialScrollIndex={index}
          style={{ marginTop: 10 }}
          horizontal={true}
          data={groups}
          renderItem={GroupList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <GroupDetails
        guid={selectedGroup}
        setIsShowingMedia={setIsShowingMedia}
        setMediaDetails={setMediaDetails}
      />
      {isShowingMedia && <MediaViewer mediaDetails={mediaDetails} />}
    </View>
  );
};

export default Group;

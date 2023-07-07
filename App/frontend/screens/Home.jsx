/* eslint-disable */

import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {Image, Text, View, TouchableNativeFeedback} from 'react-native';
import GroupDetails from './GroupDetails';

const Home = ({user}) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setselectedGroup] = useState('');

  let limit = 5;
  let groupsRequest = new CometChat.GroupsRequestBuilder()
    .setLimit(limit)
    .build();

  useEffect(() => {
    groupsRequest.fetchNext().then(
      groupList => {
        console.log('Groups list fetched successfully', groupList);
        setGroups(groupList);
      },
      error => {
        console.log('Groups list fetching failed with error', error);
      }
    );
  }, []);

  if (selectedGroup) return <GroupDetails guid={selectedGroup} />;

  return (
    <View style={{flex: 1}}>
      <Text>{user.name}</Text>
      {groups.map(grp => (
        <TouchableNativeFeedback onPress={() => setselectedGroup(grp.guid)}>
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              alignItems: 'center',
              borderWidth: 1,
              marginBottom: 10,
              marginHorizontal: 10,
              borderRadius: 10,
              elevation: 5,
              backgroundColor: 'white',
              borderColor: '#ccc',
            }}>
            <Image
              source={{
                uri: grp.icon ? grp.icon : 'https://picsum.photos/200/300',
                height: 45,
                width: 45,
              }}
              style={{borderRadius: 25, marginRight: 10}}
            />
            <Text style={{fontSize: 18, color: 'black'}}>{grp.name}</Text>
          </View>
        </TouchableNativeFeedback>
        
      ))}
    </View>
  );
};

export default Home;

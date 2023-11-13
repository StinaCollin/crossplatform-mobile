import React from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { ListItem } from '@rneui/themed';
import { Button } from '@rneui/base';

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});

  return (
    <View>
      {isLoading ? <Text>Loading...</Text> : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
            />
          }
          renderItem={({ item }) => (
            <ListItem key={item.id}>
              <ListItem.Content>
                <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
              </ListItem.Content>
              <ListItem>
                <Pressable >
                  <Button onPress={() => navigation.navigate('EditUser', { user: item })}>Edit</Button>
                </Pressable>
              </ListItem>
            </ListItem>
          )}
        />
      )}
    </View>
  );
};

export default UserList;

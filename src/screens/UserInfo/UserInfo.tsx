import { Text, Button } from "@rneui/themed";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logIn, logOut } from "../../store/slices/authSlice";
import { useGetPostsByUserQuery } from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { ListItem } from "@rneui/themed";
import { useMemo } from "react";
import { View, FlatList, RefreshControl, Pressable, StyleSheet } from "react-native";

 const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();
  const UserPostList = ({ navigation }) => {
    const { data, isLoading, refetch } = useGetPostsByUserQuery(user.id);
  
    const sortedDataByDate = useMemo(() => {
      if (!data) {
        return [];
      }
  
      return [...data].sort((a, b) =>
        `${b.createdDate}`.localeCompare(`${a.createdDate}`)
      );
    }, [data]);
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text h4>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <>
            <Button
              onPress={() => dispatch(logOut())}
              title="Logga ut"
              color="error"
            />
          </>
        ) : (
          <>
            <Button onPress={() => dispatch(logIn(user))} title="Logga in" />
          </>
        )}
      </View>
          
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={sortedDataByDate} 
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <ListItem
              key={item.id}
              onPress={() => navigation.navigate('Post', { post: item })}
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.title} ${item.text} skapad av ${item.createdBy}`}</ListItem.Title>
              </ListItem.Content>
              <ListItem>
                <Pressable>
                  <Button
                    onPress={() =>
                      navigation.navigate('EditPost', { post: item })
                    }
                  >
                    Edit
                  </Button>
                </Pressable>
              </ListItem>
            </ListItem>
          )}
        />
      )}
    </View>
  );
}};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36,
  },
  infoContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
});
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text, Button } from "@rneui/themed";
import { useGetPostsByUserNameQuery } from "../../store/api/postsApi";
import { ListItem } from "@rneui/themed";
import { View, FlatList, RefreshControl, Pressable, StyleSheet } from "react-native";
import { logIn, logOut } from "../../store/slices/authSlice";
import { createApi } from "@reduxjs/toolkit/query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config";

const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();
  const [postsToShow, setPostsToShow] = useState([]);
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = useGetPostsByUserNameQuery(
    `${user.firstName} ${user.lastName}`
  );

  useEffect(() => {
    // Fetch and log posts when the component mounts or when user changes
    handleFetchPosts();
  }, [user]);

  console.log("USER:", user);
  console.log("Posts Data:", postsData);
  console.log("Posts Loading:", postsLoading);

  const handleFetchPosts = async () => {
    console.log("Fetching posts for user:", user);

    try {
      // Step 1: Retrieve user's full name since it's stored in the posts in a name string, not an id
      const userFullName = `${user.firstName} ${user.lastName}`;

      // Step 2: Retrieve all user's posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const posts = postsSnapshot.docs
        .filter(doc => doc.data().createdBy === userFullName)
        .map(doc => doc.data());

      // Step 3: Log the posts (you can render or do other actions)
      console.log(`Posts for user ${userFullName}:`, postsToShow);
 // Set the postsToShow state
      setPostsToShow(posts);

    } catch (error) {
      console.error(error);
    }
  };

  const sortedPostsByDate = React.useMemo(() => {
    if (!postsData) {
      return [];
    }

    return [...postsData].sort((a, b) => `${b.createdDate}`.localeCompare(`${a.createdDate}`));
  }, [postsData]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text h4>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <Button onPress={() => dispatch(logOut())} title="Logga ut" color="error" />
        ) : (
          <Button onPress={() => dispatch(logIn(user))} title="Logga in" />
        )}
      </View>

      {postsLoading ? (
        <Text>Loading...</Text>
      ) : (
        // <FlatList
        //   data={sortedPostsByDate}
        //   refreshControl={<RefreshControl refreshing={postsLoading} onRefresh={refetchPosts} />}
        //   renderItem={({ item }) => (
        //     <ListItem
        //       key={item.id}
        //       onPress={() => navigation.navigate("Post", { post: item })}
        //     >
        <FlatList
  data={postsToShow}
  keyExtractor={(item) => (item.id ? item.id.toString() : null)}
  refreshControl={<RefreshControl refreshing={postsLoading} onRefresh={refetchPosts} />}
  renderItem={({ item }) => (
    <ListItem
      key={item.id}
      onPress={() => navigation.navigate("Post", { post: item })}
    >
      <ListItem.Content>
        <ListItem.Title>{item.title}</ListItem.Title>
        <ListItem.Subtitle>{item.text}</ListItem.Subtitle>
        <ListItem.Subtitle>{`Skapad av ${item.createdBy}`}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem>
        <Pressable>
          <Button
            onPress={() => navigation.navigate("EditPost", { post: item })}
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
};

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

export default UserInfo;

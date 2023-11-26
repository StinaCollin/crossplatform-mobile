import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text, Button } from "@rneui/themed";
import { useDeletePostMutation, useGetPostsByUserNameQuery } from "../../store/api/postsApi";
import { ListItem } from "@rneui/themed";
import { View, FlatList, RefreshControl, Pressable, StyleSheet } from "react-native";
import { logIn, logOut } from "../../store/slices/authSlice";
import { createApi } from "@reduxjs/toolkit/query";
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();
  const [postsToShow, setPostsToShow] = useState([]);
  const { data: postsData, isLoading: postsLoading, refetch: refetchPosts } = useGetPostsByUserNameQuery(
    `${user.firstName} ${user.lastName}`
  );
  const deletePostMutation = useDeletePostMutation();

  useEffect(() => { // hämtar inlägg för användaren
    handleFetchPosts();
  }, [user]);

  console.log("USER:", user);
  console.log("Posts Data:", postsData);
  console.log("Posts Loading:", postsLoading);

  const handleFetchPosts = async () => {
    console.log("Fetchar posts från user:", user);

    try {
      // 1: Tar fram användarens fullständiga namn eftersom det är lagrat i posts i en name-sträng, inte ett id.
      const userFullName = `${user.firstName} ${user.lastName}`;

      // 2: Hämtar alla userns posts från databasen
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const posts = postsSnapshot.docs
        .filter(doc => doc.data().createdBy === userFullName)
        .map(doc => doc.data());

      // 3: Loggar användarens inlägg
      console.log(`Posts for user ${userFullName}:`, postsToShow);

      // 4: Sätter postsToShow till de posts från usern som hämtats från databasen
      setPostsToShow(posts);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (!postId) {
        console.error("Invalid postId:", postId);
        return;
      }
  
      console.log("Deleting post with postId:", postId);
  
      // Tar bort inlägget från databasen
      await deleteDoc(doc(db, 'posts', postId));
  
      // Refetch'ar inläggen efter att ett inlägg tagits bort
      refetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
// sorterar inläggen efter datum
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

      {loggedInAs ? (
        postsLoading ? (
          <Text>Loading...</Text>
        ) : (
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
                  <ListItem.Title>Titel: {item.title}</ListItem.Title>
                  <ListItem.Subtitle>Inlägg: {item.text}</ListItem.Subtitle>
                  <ListItem.Subtitle>{`Skapad av ${item.createdBy}`}</ListItem.Subtitle>
                  <ListItem.Subtitle>{`Skapat den: ${item.createdDate}`}</ListItem.Subtitle>
                  
                  <ListItem.Subtitle style={{ color: item.isPrivate ? 'purple' : 'green' }}>
                  {item.isPrivate ? 'Private' : 'Public'} </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem>
                  <Pressable>
                  <Button
                      onPress={() => handleDeletePost(item.id)}
                    >
                      Ta bort
                    </Button>
                  </Pressable>
                </ListItem>
              </ListItem>
            )}
          />
        )
      ) : (
        <Text>Logga in för att kunna skapa och ta bort dina inlägg samt läsa dina privata inlägg. </Text>
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

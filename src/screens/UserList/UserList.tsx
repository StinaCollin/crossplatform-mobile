import { Button } from "@rneui/base";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, RefreshControl, ScrollView } from "react-native";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useGetPostsByUserQuery,
  useDeletePostMutation,
} from "../../store/api/usersApi";
import UserItem from "../UserItem/UserItem";

const UserList = () => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteUser] = useDeleteUserMutation();
  const deletePost = useDeletePostMutation();

  const sortedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data].sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
      ),
    );
  }, [data]);

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  useEffect(() => {
    const handleBulkDelete = async () => {
      console.log("Bulk delete these users:", selectedUsers);
      try {
        // Initialize an array to store all user posts
        const allUserPosts = [];

        // Fetch user's posts outside the loop
        for (const userId of selectedUsers) {
          const postsResponse = await useGetPostsByUserQuery(userId);
          const userPosts = postsResponse.data.data;

          // Add user posts to the array
          allUserPosts.push(...userPosts);
        }

        // Delete each post
        for (const post of allUserPosts) {
          await deletePost.mutate(post.id);
        }

        // Delete each user
        for (const userId of selectedUsers) {
          await deleteUser.mutate(userId);
        }

        setSelectedUsers([]);
      } catch (error) {
        console.error(error);
      }
    };

    // Call handleBulkDelete when selectedUsers change
    if (selectedUsers.length > 0) {
      handleBulkDelete();
    }
  }, [selectedUsers, deleteUser, deletePost, useGetPostsByUserQuery]);



  return (
    <ScrollView>
      <View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
            <FlatList
              data={sortedData}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
              }
              renderItem={({ item }) => (
                <UserItem
                  user={item}
                  onSelect={handleUserSelect}
                  isSelected={selectedUsers.includes(item.id)}
                />
              )}
            />
            {selectedUsers.length > 0 && (
              <Button onPress={handleBulkDelete} title="Bulk delete" />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UserList;
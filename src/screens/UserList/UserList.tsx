import { Button, CheckBox } from "@rneui/base";
import { ListItem } from "@rneui/themed";
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { ScrollView } from "react-native";
import { doc, getDocs, collection, deleteDoc, getDoc } from 'firebase/firestore';
import { useDeleteUserMutation, useGetUsersQuery } from "../../store/api/usersApi";
import UserItem from "../UserItem/UserItem";
import { db } from "../../../firebase-config";

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteUser] = useDeleteUserMutation();

  const sortedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data].sort((a, b) => 
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    
    );
  }, [data]);

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkDelete = async () => {
    console.log("Bulk delete these users:", selectedUsers);
  
    try {
      for (const userId of selectedUsers) {
        // Step 1: Retrieve User's Full Name
        const userSnapshot = await getDoc(doc(db, 'users', userId));
        const userFullName = `${userSnapshot.data().firstName} ${userSnapshot.data().lastName}`;
  
        // Step 2: Retrieve User's Posts
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsToDelete = postsSnapshot.docs
          .filter(doc => doc.data().createdBy === userFullName)
          .map(doc => doc.ref);
  
        // Step 3: Delete User's Posts
        const deletePostsPromises = postsToDelete.map(postRef => deleteDoc(postRef));
        await Promise.all(deletePostsPromises);
  
        // Step 4: Delete User
        await deleteUser(userId);
      }
      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
    }
  };
  

    return (
      <ScrollView>
      
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <FlatList
            data={sortedData}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
            renderItem={({ item }) => (
              <UserItem
                user={item}
                onSelect={handleUserSelect}
                isSelected={selectedUsers.includes(item.id)}
              />
            )}
          />
          {selectedUsers.length > 0 && (
            <Button onPress={handleBulkDelete} title="Delete /Bulk delete" />
          )}
        </ScrollView>
      )}
    
    </ScrollView>
    );
  };


export default UserList;


import { Button, CheckBox } from "@rneui/base";
import { ListItem } from "@rneui/themed";
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { ScrollView } from "react-native";
import { doc, getDocs, collection, deleteDoc, getDoc } from 'firebase/firestore';
import { useDeleteUserMutation, useGetUsersQuery } from "../../store/api/usersApi";
import UserItem from "../UserItem/UserItem";
import { db } from "../../../firebase-config";
import Icon from 'react-native-vector-icons/FontAwesome';

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
        //  1: Ta fram användarens fullständiga namn, eftersom den är lagrad i posterna i en namn sträng och inte id
        const userSnapshot = await getDoc(doc(db, 'users', userId));
        const userFullName = `${userSnapshot.data().firstName} ${userSnapshot.data().lastName}`;
  
        //  2: Hämtar alla userns posts från databasen
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        const postsToDelete = postsSnapshot.docs
          .filter(doc => doc.data().createdBy === userFullName)
          .map(doc => doc.ref);
  
        //  3: Radera alla markerade inlägg
        const deletePostsPromises = postsToDelete.map(postRef => deleteDoc(postRef));
        await Promise.all(deletePostsPromises);
  
        //  4: Radera användaren
        await deleteUser(userId);
      }
      setSelectedUsers([]);   // Rensa valda användare
    } catch (error) {  // Om något går fel, så visas felmeddelande
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
            <Pressable onPress={handleBulkDelete} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            {({ pressed }) => (
              <View style={{ backgroundColor: '#eee',                 
              borderWidth: 1,
              borderColor: 'grey', 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 10 }}>
                <Text style={{ marginRight: 10, fontWeight: 600 }}>Delete / Bulk delete</Text>
                <Icon name="trash" size={30} color={pressed ? 'gray' : 'red'} />
              </View>
            )}
          </Pressable>
          )}
        </ScrollView>
      )}
    
    </ScrollView>
    );
  };


export default UserList;


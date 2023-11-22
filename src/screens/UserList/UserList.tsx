import { Button, CheckBox } from "@rneui/base";
import { ListItem } from "@rneui/themed";
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { ScrollView } from "react-native";

import { useDeleteUserMutation, useGetUsersQuery } from "../../store/api/usersApi";
import UserItem from "../UserItem/UserItem";

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




// import { Button } from "@rneui/base";
// import React, { useEffect, useMemo, useState } from "react";
// import { View, Text, FlatList, RefreshControl, ScrollView } from "react-native";

// import {
//   useDeleteUserMutation,
//   useGetUsersQuery,
// } from "../../store/api/usersApi";
// import UserItem from "../UserItem/UserItem";

// const UserList = () => {
//   const { data, isLoading, refetch } = useGetUsersQuery({});
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [deleteUser] = useDeleteUserMutation();

//   const sortedData = useMemo(() => {
//     if (!data) {
//       return [];
//     }

//     return [...data].sort((a, b) =>
//       `${a.firstName} ${a.lastName}`.localeCompare(
//         `${b.firstName} ${b.lastName}`,
//       ),
//     );
//   }, [data]);

//   const handleUserSelect = (userId) => {
//     if (selectedUsers.includes(userId)) {
//       setSelectedUsers(selectedUsers.filter((id) => id !== userId));
//     } else {
//       setSelectedUsers([...selectedUsers, userId]);
//     }
//   };

//   const handleBulkDelete = async () => {
//     try {
//       // Delete each user
//       for (const userId of selectedUsers) {
//         await deleteUser({ id: userId }); // Use deleteUser function with the user ID
//       }

//       setSelectedUsers([]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     // Call handleBulkDelete when selectedUsers change
//     if (selectedUsers.length > 0) {
//       handleBulkDelete();
//     }
//   }, [selectedUsers, deleteUser, refetch]);

//   return (
//     <ScrollView>
//       <View>
//         {isLoading ? (
//           <Text>Loading...</Text>
//         ) : (
//           <View>
//             <FlatList
//               data={sortedData}
//               refreshControl={
//                 <RefreshControl refreshing={isLoading} onRefresh={refetch} />
//               }
//               renderItem={({ item }) => (
//                 <UserItem
//                   user={item}
//                   onSelect={handleUserSelect}
//                   isSelected={selectedUsers.includes(item.id)}
//                 />
//               )}
//             />
//             {selectedUsers.length > 0 && (
//               <Button onPress={handleBulkDelete} title="Bulk delete" />
//             )}
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default UserList;

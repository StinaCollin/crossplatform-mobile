import { useNavigation } from "@react-navigation/native";
import { ListItem, Button, CheckBox } from "@rneui/base";
import React from "react";

const UserItem = ({ user, onSelect, isSelected }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("UserInfo", { user });
  };

  return (
    <ListItem>
      <CheckBox checked={isSelected} onPress={() => onSelect(user.id)} />
      <ListItem.Content>
        <ListItem.Title
          key={user.id}
          onPress={handlePress}
        >{`${user.firstName} ${user.lastName}`}</ListItem.Title>
      </ListItem.Content>
      <ListItem>
         <Button onPress={() => navigation.navigate("EditUser", { user })}>
          Edit
        </Button> 
      </ListItem>
    </ListItem>
  );
};

export default UserItem;

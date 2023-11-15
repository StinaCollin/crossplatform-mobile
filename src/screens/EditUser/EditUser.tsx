import { Input, Button } from "@rneui/themed";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../store/api/usersApi";

export const UserUpdate = ({ route, navigation }) => {
  const { user } = route.params;
  const [firstName, setFirstName] = useState(route?.params?.user?.firstName || "");
  const [lastName, setLastName] = useState(route?.params?.user?.lastName || "");
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const toast = useToast();

  const handleUpdate = async () => {
    try {
      if (!user) {
        // OM 'user' är undefined
        console.error("User is undefined");
        return;
      }

      await updateUser({ user: { id: user.id, firstName: firstName, lastName: lastName }})
      toast.show(`Användaren ${firstName} ${lastName} har uppdaterats!`, {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    } catch (error) {
      toast.show(error, { type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      toast.show(`Användaren ${firstName} ${lastName} har tagits bort!`, {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      navigation.navigate("UserList");
    } catch (error) {
      toast.show(error, { type: "error" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <Text>Redigera användare</Text>
          <Input
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            placeholder="Förnamn"
          />
          <Input
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder="Efternamn"
          />
          <Button
            title="Uppdatera användare"
            disabled={isUpdating}
            loading={isUpdating}
            onPress={() => handleUpdate()}
          />

          <Button
            style={styles.delete}
            title="Ta bort användare"
            disabled={isDeleting}
            loading={isDeleting}
            onPress={() => handleDelete()}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserUpdate;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 36,
    marginTop: 84,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 16,
  },
  delete: {
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
});

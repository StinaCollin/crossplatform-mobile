import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useUpdateUserMutation, useDeleteUserMutation } from '../../store/api/usersApi';
import { useToast } from 'react-native-toast-notifications';
import React, { useState } from 'react';

export const UserUpdate = ({ route, navigation }) => {
  const { user } = route.params;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const toast = useToast();

  const handleUpdate = async () => {
	try {
	  if (!user) {
		// Handle the case where 'user' is undefined
		console.error('User is undefined');
		return;
	  }
  
	  await updateUser({ id: user.id, data: { firstName, lastName } });
	  toast.show(`Användaren ${firstName} ${lastName} har uppdaterats!`, {
		type: 'success',
		placement: 'top',
		duration: 4000,
		animationType: 'slide-in',
	  });
	} catch (error) {
	  toast.show(error, { type: 'error' });
	}
  };
  

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      toast.show(`Användaren ${firstName} ${lastName} har tagits bort!`, {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
      navigation.navigate('UserList');
    } catch (error) {
      toast.show(error, { type: 'error' });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <Text>Skapa användare</Text>
          <Input
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            placeholder="Förnamn"
            // ... andra props för Input-komponenten
          />
          <Input
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder="Efternamn"
            // ... andra props för Input-komponenten
          />
          <Button
            title= 'Skapa användare'
            disabled={isUpdating}
			loading={isUpdating}
            onPress={() => handleUpdate()}
            // ... andra props för Button-komponenten
          />
          
            <Button
              title="Ta bort användare"
              disabled={isDeleting}
              loading={isDeleting}
              onPress={() => handleDelete()}
              // ... andra props för Button-komponenten
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
    backgroundColor: 'white',
    margin: 36,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});
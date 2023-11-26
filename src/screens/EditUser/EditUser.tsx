import { useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Input, Button } from '@rneui/themed';
import { useUpdateUserMutation } from "../../store/api/usersApi";
import { useToast } from "react-native-toast-notifications";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const UserForm = (props) => {  // skickar med props från UserList
	const { route, navigation } = props	
	const lastNameRef = React.useRef(null)
	const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
	const user = route?.params?.user || loggedInAs;
	const [firstName, setFirstName] = useState(route?.params?.user?.firstName || '')
	const [lastName, setLastName] = useState(route?.params?.user?.lastName || '')
	const [updateUser, { isLoading }] = useUpdateUserMutation()
	const toast = useToast()

	const handleEdit = async () => {  // hanterar redigering av användare
		console.log('firstName:', firstName);
		console.log('lastName:', lastName);
	  
		try {
		  await updateUser({
			id: user.id,
			data: {
			  firstName: firstName,
			  lastName: lastName,
			},
		  });
	  
		  navigation.navigate('UserList');
		  toast.show(`Användaren ${firstName} ${lastName} har ändrats!`, {
			type: 'success',
			placement: 'top',
			duration: 4000,
			animationType: 'slide-in',
		  });
		  setFirstName('');
		  setLastName('');
		} catch (error) {
		  toast.show(error, { type: 'danger' });
		}
	  };
	  
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		<View style={styles.parentContainer}>
		<View> 
          <Text style={styles.loggedintext}>{`   Inloggad som:  ${user.firstName} ${user.lastName}`}</Text>
        </View>
			<View style={styles.container}>
				<Text>Redigera användare: </Text>
				<Input 
				returnKeyType='next'
				onSubmitEditing={() =>  lastNameRef.current.focus() }
				blurOnSubmit={false}
				value={firstName} 
				disabled={isLoading}
				onChangeText={(text) => setFirstName(text)} 
				placeholder="Förnamn"></Input>
				<Input 
				ref={lastNameRef}
				value={lastName} 
				disabled={isLoading}
				returnKeyType='send'
				onSubmitEditing={() => handleEdit()}
				onChangeText={(text) => setLastName(text)} 
				placeholder="Efternamn">
				</Input>
				<Button 
				title="Redigera användare" 
				disabled={isLoading}
				loading={isLoading}
				onPress={() => handleEdit()}></Button>	
			</View>
		</View>
		</TouchableWithoutFeedback>
	)
}

export default UserForm

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
		alignItems: 'center'
	},
	loggedintext: {
		color: "green",
		padding: 7,
	  },
	title:{
	  fontSize: 20,
	  fontWeight: "bold",
	  color: "grey",
	  marginBottom: 12,
	}
})

import { useRef, useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Input, Button } from '@rneui/themed';
import { useCreateUserMutation } from "../../store/api/usersApi";
import { useToast } from "react-native-toast-notifications";
import React from 'react';

export const UserForm = (props) => { 
	const { navigation } = props	
	const lastNameRef = useRef(null)

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [createUser, { isLoading }] = useCreateUserMutation()
	const toast = useToast()

	const handleSubmit = () => {
		console.log('firstName: ', firstName)
		console.log('lastName: ', lastName)

		if (firstName === "" || lastName === "") {
			// show toast, must fill all inputs
			console.log('Invalid form!')	
			toast.show("Please fill out all inputs", {
				type: "warning",
				placement: "top",
				duration: 4000,
				animationType: "slide-in",
			});	
			return
		}

		createUser({
			user: {
				firstName: firstName,
				lastName: lastName,
			}
		}).then(() => {
			navigation.navigate('UserList')	
			toast.show(`Användaren ${firstName} ${lastName} har skapats!`, {
				type: "success",
				placement: "top",
				duration: 4000,
				animationType: "slide-in",
			});
			setFirstName('')
			setLastName('')
		}).catch((error) => {
			toast.show(error, { type: "danger" })
		})
	}

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.parentContainer}>
				<View style={styles.container}>
					<Text style={styles.title}>Skapa din användare</Text>
					<Input
						returnKeyType="next"
						onSubmitEditing={() => lastNameRef.current.focus()}
						blurOnSubmit={false}	
						value={firstName}
						disabled={isLoading}
						onChangeText={(text) => setFirstName(text)}
						placeholder="Förnamn">
					</Input>
					<Input
						ref={lastNameRef}
						value={lastName}
						disabled={isLoading}
						returnKeyType="send"
						onSubmitEditing={() => handleSubmit()}
						onChangeText={(text) => setLastName(text)}
						placeholder="Efternamn">
					</Input>
					<Button
						title="Skapa användare"
						disabled={isLoading}
						loading={isLoading}
						onPress={() => handleSubmit()}>
					</Button>	
				</View>
			</View>
		</TouchableWithoutFeedback>	
	)
}

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
	container: {
		flex: 1,
		padding: 16,
		alignItems: "center",
	  },
	title:{
	   fontSize: 20,
	   fontWeight: "bold",
	   color: "grey",
	   marginBottom: 12,
	}
})
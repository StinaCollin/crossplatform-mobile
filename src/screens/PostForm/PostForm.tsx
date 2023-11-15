import { Input, Button } from "@rneui/themed";
import React, { useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useCreatePostMutation, useGetPostsQuery } from "../../store/api/postsApi";
import toast from "react-native-toast-notifications/lib/typescript/toast";

const CreatePostComponent = () => {
  const [postText, setPostText] = useState('');
  const createPostMutation = useCreatePostMutation();
  
  const handleCreatePost =  () => {
    if (postText === '') {
        
      console.log('Invalid form!');
      toast.show("Please fill out all inputs", {
                 type: "warning",
                 placement: "top",
                 duration: 4000,
                 animationType: "slide-in",
               });
      return;

      return;
          }
      
          createUser({
            user: {
              firstName,
              lastName,
            },
          })
            .then(() => {
              navigation.navigate("UserList");
              toast.show(`Användaren ${firstName} ${lastName} har skapats!`, {
                type: "success",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              });
              setFirstName("");
              setLastName("");
            })
            .catch((error) => {
              toast.show(error, { type: "danger" });
            });
        };
      
        return (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.parentContainer}>
              <View style={styles.container}>
                <Text>Create your user</Text>
                <Input
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current.focus()}
                  blurOnSubmit={false}
                  value={firstName}
                  disabled={isLoading}
                  onChangeText={(text) => setFirstName(text)}
                  placeholder="First name"
                />
                <Input
                  ref={lastNameRef}
                  value={lastName}
                  disabled={isLoading}
                  returnKeyType="send"
                  onSubmitEditing={() => handleSubmit()}
                  onChangeText={(text) => setLastName(text)}
                  placeholder="Last name"
                />
                <Button
                  title="Create user"
                  disabled={isLoading}
                  loading={isLoading}
                  onPress={() => handleCreatePost()}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      };
      
      
      
      
 
export default CreatePostComponent;

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
  });



   
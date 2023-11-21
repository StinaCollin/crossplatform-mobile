import { Input, Button } from "@rneui/themed";
import React, { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

import { useCreatePostMutation } from "../../store/api/postsApi";

export const PostForm = (props) => {
  const { navigation } = props;
  const inputTextRef = useRef(null);
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();
  const toast = useToast();
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = loggedInAs;

  const handleSubmit = async () => {
    console.log("postTitle: ", postTitle);
    console.log("postText: ", postText);

    if (postTitle === "" || postText === "") {
      console.log("Invalid form!");
      toast.show("Please fill out all fields", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }

    try {
      
      const postDate = new Date().toLocaleDateString("sv-SE");

      const postData = {
        title: postTitle,
        text: postText,
        createdBy: user.firstName + " " + user.lastName,
        createdDate: postDate,
      };

      await createPost({ post: postData });

      navigation.navigate("PostList");
      toast.show(`Ditt inlägg ${postTitle}, har skapats den ${postDate}!`, {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      setPostTitle("");
      setPostText("");
    } catch (error) {
      toast.show(error, { type: "danger" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.parentContainer}>
        <View>
          <Text style={styles.loggedintext}>{`   Inloggad som:  ${user.firstName} ${user.lastName}`}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Skapa ditt inlägg:</Text>
          <Input
            returnKeyType="next"
            onSubmitEditing={() => inputTextRef.current.focus()}
            blurOnSubmit={false}
            value={postTitle}
            disabled={isLoading}
            onChangeText={(text) => setPostTitle(text)}
            placeholder="Titel"
          />
          <Input
            ref={inputTextRef}
            value={postText}
            disabled={isLoading}
            returnKeyType="send"
            onSubmitEditing={() => handleSubmit()}
            onChangeText={(text) => setPostText(text)}
            placeholder="Skriv ditt inlägg här..."
          />
          <Button
            title="Skapa inlägg"
            disabled={isLoading}
            loading={isLoading}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostForm;


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

});

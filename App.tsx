import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import * as React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import EditUser from "./src/screens/EditUser/EditUser";
import PostForm from "./src/screens/PostForm/PostForm";
import PostList from "./src/screens/PostList/PostList";
import { UserForm } from "./src/screens/UserForm/UserForm";
import UserInfo  from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/UserList";
import { persistor, store } from "./src/store/store";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserListStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      <UserListStack.Screen name="EditUser" component={EditUser} />
      <UserListStack.Screen name="PostForm" component={PostForm} />
      <UserListStack.Screen name="PostList" component={PostList} />
    </UserListStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="User List"
          component={UserListStackScreen}
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" color={color} size={size} />
            ), }}
        />
        <Tab.Screen name="User Form" 
            component={UserForm}          
            options={{ 
              tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-plus" 
              color={color} 
              size={size} />
            ), }}/>
        <Tab.Screen name="Post List" component={PostList}
                    options={{ 
                      tabBarIcon: ({ color, size }) => (
                      <FontAwesome name="list" 
                      color={color} 
                      size={size} />
                    ), }} />
        {loggedInAs && (
          <>
            <Tab.Screen
              name="UserInfo"
              component={UserInfo}
              options={{
                title: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="user" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen name="Post Form" 
            component={PostForm} 
            options={{ 
              tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="post-add" 
              color={color} 
              size={size} />
            ), }}/>
          
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationWrapper />
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}

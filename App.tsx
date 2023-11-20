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
import { UserInfo } from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/UserList";
// eslint-disable-next-line import/namespace
import { persistor, store } from "./src/store/store";

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
          options={{ headerShown: false }}
        />
        <Tab.Screen name="User Form" component={UserForm} />
        <Tab.Screen name="Post List" component={PostList} />
        {loggedInAs && (
          <>
            <Tab.Screen
              name="UserInfo"
              component={UserInfo}
              options={{
                title: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
              }}
            />
            <Tab.Screen name="Post Form" component={PostForm} />
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

import { Provider, useSelector } from 'react-redux';
import { Button } from '@rneui/base'; 
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { store } from './src/store/store';
import UserList from './src/screens/UserList/UserList';
import { UserForm } from './src/screens/UserForm/UserForm';
import { ToastProvider } from 'react-native-toast-notifications'
import { UserInfo } from './src/screens/UserInfo/UserInfo';
import EditUser from './src/screens/EditUser/EditUser';

const UserListStack = createNativeStackNavigator()

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      <UserListStack.Screen name="EditUser" component={EditUser} />
    </UserListStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs)

  return (
<NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="UserListStack" component={UserListStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="UserForm" component={UserForm} />
          {loggedInAs && (
            <Tab.Screen name="UserInfo" component={UserInfo} options={{ title: `${loggedInAs.firstName} ${loggedInAs.lastName}`}} />
          )}
        </Tab.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
    <ToastProvider>
    <Provider store={store}>
      <NavigationWrapper />
    </Provider>
  </ToastProvider>
);
}
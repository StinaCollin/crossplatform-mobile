import React from "react"
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native"
import { useGetUsersQuery } from "../../store/api/usersApi"
import { ListItem } from "@rneui/themed"
import { Button } from "@rneui/base"

const UserList = ({ navigation }) => {
    const { data, isLoading, refetch } = useGetUsersQuery({})

    return (
        <View>
            {isLoading ? <Text> Loading...</Text> : (
                <FlatList
                    data={data}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                    renderItem={({ item }) => (
                        <ListItem key={item.id}
                        onPress={() => navigation.navigate('UserInfo', { user: item})}>
                            <ListItem.Content>
                                <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem>
                            <TouchableOpacity onPress={() => navigation.navigate('UserForm', { user: item, isEditMode: true })}>
                                <Button>Edit</Button>
                            </TouchableOpacity>
                            </ListItem>
                        </ListItem>
                    )}
                />
            )}
        </View>
    )
}

export default UserList

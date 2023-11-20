import { Button } from "@rneui/base";
import { ListItem } from "@rneui/themed";
import React, { useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";

import { useGetPostsQuery } from "../../store/api/postsApi";

const PostList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetPostsQuery({});
  const sortedDataByDate = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data].sort((a, b) => 
    `${b.createdDate}`.localeCompare(`${a.createdDate}`)
    
    );
  }, [data]);


  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <ListItem key={item.id}
            onPress={() => navigation.navigate('Post', { post: item})}>
              <ListItem.Content>
                <ListItem.Title>{`${item.title} ${item.text} skapad av ${item.createdBy}`}</ListItem.Title>
              </ListItem.Content>
              <ListItem>
                <Pressable>
                  <Button
                    onPress={() =>
                      navigation.navigate("EditPost", { user: item })
                    }
                  >
                    Edit
                  </Button>
                </Pressable>
              </ListItem>
            </ListItem>
          )}
        />
      )}
    </View>
  );
};

export default PostList;

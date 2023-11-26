import { Button } from "@rneui/base";
import { ListItem } from "@rneui/themed";
import React, { useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";

import { useGetPostsQuery } from "../../store/api/postsApi";

const PostList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetPostsQuery({});
  const sortedDataByDate = useMemo(() => {  // sorterar inläggen efter datum
    if (!data) {
      return [];
    }

    return [...data].sort((a, b) => 
    `${b.createdDate}`.localeCompare(`${a.createdDate}`)
    
    );
  }, [data]);

  const filteredData = sortedDataByDate.filter((item) => !item.isPrivate); // filtrerar bort privata inlägg

  return (
    
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredData}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <ListItem key={item.id}
            onPress={() => navigation.navigate('Post', { post: item})}>
              <ListItem.Content>
              <ListItem.Title>Titel: {item.title}</ListItem.Title>
                  <ListItem.Subtitle>Inlägg: {item.text}</ListItem.Subtitle>
                  <ListItem.Subtitle>{`Skapad av: ${item.createdBy}`}</ListItem.Subtitle>
                  <ListItem.Subtitle>{`Skapat den: ${item.createdDate}`}</ListItem.Subtitle>
                  <ListItem.Subtitle style={{ color: item.isPrivate ? 'purple' : 'green' }}> 
                  {item.isPrivate ? 'Private' : 'Public'} </ListItem.Subtitle>
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

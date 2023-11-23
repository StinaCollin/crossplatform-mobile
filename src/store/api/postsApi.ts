import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
  where,
  query,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

// const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
//   switch (method) {
//     case "GET":
//       const snapshot = await getDocs(collection(db, url));
//       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       return { data };
const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET":
      if (url === "posts") {
        const snapshot = await getDocs(collection(db, url));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Firestore GET Data:", data);
        return { data };
      } else if (url.startsWith("posts/CreatedBy")) {
        const createdBy = url.split("/")[1];
        const snapshot = await getDocs(collection(db, "posts", "CreatedBy", createdBy));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Firestore GET Data by CreatedBy:", data);
        return { data };
      }
    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };

    case "DELETE":
      const docDelRef = await deleteDoc(doc(db, url, body));
      return { data: { id: docDelRef } };

    case "PUT":
      await updateDoc(doc(db, url, body.id), body);
      return { data: { ...body } };

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["posts"],
  endpoints: (builder) => ({
    // För att skapa en ny post. Anropas såhär createPost({ user: { firstName: firstName, lastName: lastName }})
    createPost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    // För att hämta alla befintliga users
    getPosts: builder.query({
      query: () => ({
        baseUrl: "",
        url: "posts",
        method: "GET",
        body: "",
      }),
      providesTags: ["posts"],
    }),
    // För att radera en post baserat på id. Anropas såhär: deletePost(id)
    deletePost: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "posts",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["posts"],
    }),
    // För att uppdatera en posr. Anropas såhär updateUser({ user: { id: user.id, firstName: firstName, lastName: lastName }})
    updatePost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "PUT",
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    // För att hämta alla posts skapade av en spacifik user. Anropas såhär: getPostByUser(id)
getPostsByUser: builder.query({
  query: (createdBy) => ({
    baseUrl: "",
    url: `posts/CreatedBy/${createdBy}`,
    method: "GET",
    // body: createdBy,
     body: { createdBy },
  }),
  providesTags: (result, error, createdBy) => [{ type: "posts", id: createdBy }],
}),
// getPostsByUserName: builder.query({
//   query: ({ firstName, lastName }) => ({
//     baseUrl: "",
//     url: "posts",
//     method: "GET",
//     // Use the firstName and lastName to filter posts
//     body: `CreatedBy/${firstName} ${lastName}`,
//   }),
//   providesTags: (result, error, { firstName, lastName }) => [
//     { type: "posts", createdBy: `${firstName} ${lastName}` },
//   ],
// }),
getPostsByUserName: builder.query({
  query: ({ createdBy }) => ({
    baseUrl: '',
    url: 'posts',
    method: 'GET',
    body: { createdBy }, // Pass the createdBy parameter to filter posts
  }),
  providesTags: ['posts'],
}),
// getPostsByUserName: builder.query({
//   query: (user) => {
//     // Fetch user by name to get the ID
//     const userQuery = query(collection(db, "users"), where("fullName", "==", user));
//     return getDocs(userQuery).then((userSnapshot) => {
//       if (userSnapshot.docs.length > 0) {
//         const userId = userSnapshot.docs[0].id;

//         // Fetch posts by user ID
//         const postsQuery = query(collection(db, "posts"), where("createdByUserId", "==", userId));
//         return getDocs(postsQuery).then((snapshot) =>
//           snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//         );
//       } else {
//         // User not found, return empty array
//         return [];
//       }
//     });
//   },
//   providesTags: (result, error, userName) => [{ type: "Posts", userName }],
// }),


}),
});

// Exportera våra Queries och Mutations här.
export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetPostsByUserQuery,
  useGetPostsByUserNameQuery,
} = postsApi;
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

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET":
      if (url === "posts") { 
        const snapshot = await getDocs(collection(db, url));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Firestore GET Data:", data);
        return { data };
      } else if (url.startsWith("posts/CreatedBy")) { // Om URL:en börjar med posts/CreatedBy, så ska vi hämta alla posts som har en createdBy som matchar parametern
        const createdBy = url.split("/")[1]; // Get parametern från URL:en
        const snapshot = await getDocs(collection(db, "posts", "CreatedBy", createdBy)); // Hämta alla posts som har en createdBy som matchar parametern
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
    // För att radera en post baserat på namnet. Anropas såhär: deletePost(user.fullName)
    deletePost: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "posts",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["posts"],
    }),
    // För att uppdatera en post. Anropas såhär updateUser({ user: { id: user.id, firstName: firstName, lastName: lastName }})
    updatePost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "PUT",
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    // För att hämta alla posts skapade av en specifik user. Anropas såhär: getPostByUser(id)
getPostsByUser: builder.query({
  query: (createdBy) => ({
    baseUrl: "",
    url: `posts/CreatedBy/${createdBy}`,
    method: "GET",
     body: { createdBy },
  }),
  providesTags: (result, error, createdBy) => [{ type: "posts", id: createdBy }],
}),
getPostsByUserName: builder.query({ // Hämtar alla posts som har en createdBy som matchar parametern
  query: ({ createdBy }) => ({
    baseUrl: '',
    url: 'posts',
    method: 'GET',
    body: { createdBy }, // skickar med createdBy som body
  }),
  providesTags: ['posts'],
}),

}),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetPostsByUserQuery,
  useGetPostsByUserNameQuery,
} = postsApi;
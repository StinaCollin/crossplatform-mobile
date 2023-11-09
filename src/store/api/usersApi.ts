import { createApi } from '@reduxjs/toolkit/query/react';
import { db } from '../../../firebase-config';
import { addDoc, doc, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
	switch (method) {
		case 'GET':
			const snapshot = await getDocs(collection(db, url));	
			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			return { data };

		case 'POST':
			const docRef = await addDoc(collection(db, url), body);
			return { data: { id: docRef.id, ...body } };

		case 'DELETE':
			const docDelRef = await deleteDoc(doc(db, url, body));
			return { data: { id: docDelRef, } };
		
		case 'PUT':
			await updateDoc(doc(db, url, body.id), body);
			return { data: { ...body } };
		
		default:
			throw new Error(`Unhandled method ${method}`);
	}
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
	baseQuery: firebaseBaseQuery,
	tagTypes: ['users'],
	endpoints: (builder) => ({
		// För att skapa en ny user. Anropas såhär createUser({ user: { firstName: firstName, lastName: lastName }})
		createUser: builder.mutation({
			query: ({ user }) => ({
				baseUrl: '',
				url: 'users',
				method: 'POST',
				body: user
			}),
			invalidatesTags: ['users']
		}),
		// För att hämta alla befintliga users
		getUsers: builder.query({
			query: () => ({
				baseUrl: '',
				url: 'users',
				method: 'GET',
				body: ''
			}),
			providesTags: ['users']
		}),
		// För att radera en user baserat på id. Anropas såhär: deleteUser(id)
		deleteUser: builder.mutation({
			query: (id) => ({
				baseUrl: '',
				url: 'users',
				method: 'DELETE',
				body: id
			}),
			invalidatesTags: ['users']
		}),
		// För att uppdatera en user. Anropas såhär updateUser({ user: { id: user.id, firstName: firstName, lastName: lastName }})	
		updateUser: builder.mutation({
			query: ({ user }) => ({
				baseUrl: '',
				url: 'users',
				method: 'PUT',
				body: user
			}),
			invalidatesTags: ['users']
		}),
	}),
});

// Exportera våra Queries och Mutations här.
export const { useCreateUserMutation, useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } = usersApi;

// import { createApi } from '@reduxjs/toolkit/query/react';
// import { db } from '../../../firebase-config';
// import { addDoc, collection, getDocs } from "firebase/firestore";

// const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
// 	switch (method) {
// 		case 'GET':
// 			const snapshot = await getDocs(collection(db, url));	
// 			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// 			return { data };

// 		case 'POST':
// 			const docRef = await addDoc(collection(db, url), body);
// 			return { data: { id: docRef.id, ...body } };

// 		default:
// 			throw new Error(`Unhandled method ${method}`);
// 	}
// };

// export const usersApi = createApi({
//   reducerPath: 'usersApi',
// 	baseQuery: firebaseBaseQuery,
// 	endpoints: (builder) => ({
// 		createUser: builder.mutation({
// 			query: ({ user }) => ({
// 				baseUrl: '',
// 				url: 'users',
// 				method: 'POST', // PUT = modifiera data - DELETE = ta bort data
// 				body: user
// 			}),
// 		}),
//     // Lägg till din getUsers här
//     getUsers: builder.query({
//         query: () => ({
//             baseUrl: '',
//             url: 'users',
//             method: 'GET',
//             body: ''
//         }),
// 	}),
// })

// export const { useCreateUserMutation, useGetUsersQuery } = usersApi;



// import { createApi } from '@reduxjs/toolkit/query/react'
// import { db } from '../../../firebase-config'
// import {
//   addDoc,
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   setDoc
// } from 'firebase/firestore'
 
 
 
// const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
//   switch (method) {
//     case 'GET':
//       const snapshot = await getDocs(collection(db, url))
//       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       return { data }
 
//     case 'POST':
//       const docRef = await addDoc(collection(db, url), body)
//       return { data: { id: docRef.id, ...body } }
 
//     case 'PUT':
//       const putRef = await setDoc(doc(db, url, body.id), body)
//       return { data: { id: putRef, ...body } }
 
//     case 'DELETE':
//       const delRef = await deleteDoc(doc(db, url, body.id))
//       return { data: { id: delRef, ...body } }
 
//     default:
//       throw new Error(`Unhandled method ${method}`)
//   }
// }
 
// export const usersApi = createApi({
//   reducerPath: 'usersApi',
//   baseQuery: firebaseBaseQuery,
//   endpoints: (builder) => ({
//     createUser: builder.mutation({
//       query: ({ user }) => ({
//         baseUrl: '',
//         url: 'users',
//         method: 'POST',
//         body: user
//       })
//     }),
//     getUsers: builder.query({
//       query: () => ({
//         baseUrl: '',
//         url: 'users',
//         method: 'GET',
//         body: ''
//       })
//     }),
 
//     editUser: builder.mutation({
//       // putUser: builder.query({
//       query: (User) => ({
//         baseUrl: '',
//         url: 'users',
//         method: 'PUT',
//         body: User
//       })
//     }),
//     deleteUser: builder.mutation({
//       query: (id) => ({
//         baseUrl: '',
//         url: 'users',
//         method: 'DELETE',
//         body: id
//       })
//     })
//   })
// })
 
// export const {
//   useCreateUserMutation,
//   useGetUsersQuery,
//   useDeleteUserMutation,
//   useEditUserMutation
// } = usersApi
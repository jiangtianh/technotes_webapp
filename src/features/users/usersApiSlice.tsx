import { createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { BaseState } from "../../app/store";


export type UserType = {
    _id: string;
    id: string;
    username: string;
    password: string;
    roles: string[];
    active: boolean;
}

const usersAdapter = createEntityAdapter({
    selectId: (user: UserType) => user.id
});

const initialState = usersAdapter.getInitialState();


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getUsers: builder.query<EntityState<UserType, string>, void>({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => 
                    response.status === 200 && !result.isError,
            }),
            transformResponse: (responseData: UserType[]) => {
                const loadedUsers = responseData.map((user) => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) : { type: 'User', id: string }[] => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User' as const, id}))
                    ]
                } else {
                    return [{ type: 'User', id: 'LIST' }]
                }
            },
        }),

        addNewUser: builder.mutation<UserType, Partial<UserType>>({
            query: (newUserData) => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...newUserData,
                }
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),

        updateUser: builder.mutation<UserType, Partial<UserType>>({
            query: (updateUserData) => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...updateUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        }),

        deleteUser: builder.mutation<void, Partial<UserType>>({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }] 
        })

    })
})

export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApiSlice;

// returns the query result object
const selectUsersResult = userApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    (usersResult) => usersResult.data // normalized state object with ids & entities
)

// getSelectors creates these selectors and we rename them with aliases 
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
    // pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state: BaseState) => selectUsersData(state) ?? initialState);
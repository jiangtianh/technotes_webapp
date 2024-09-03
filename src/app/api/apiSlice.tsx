import { createApi, fetchBaseQuery, FetchBaseQueryError, FetchArgs, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { BaseState } from '../store';
import { setCredentials } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include', // This make sure we always send our cookies
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as BaseState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        console.log('Sending refresh token');

        // Send refresh token to get new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult?.data) {
            // Store the new token
            api.dispatch(setCredentials({ ...refreshResult.data }));
            console.log(refreshResult.data);
            // Retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                if (typeof refreshResult.error.data === 'object' && refreshResult.error.data !== null && 'message' in refreshResult.error.data) {
                    (refreshResult.error.data as { message: string }).message = "Your login has expired.";
                }
            }
            return refreshResult;
        }
    }
    return result
}


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})
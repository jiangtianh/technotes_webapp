import { createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { BaseState } from "../../app/store";

export type Note = {
    id: string;
    _id: string;
    user: string;
    title: string;
    text: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    ticket: number
}


const notesAdapter = createEntityAdapter({
    selectId: (note: Note) => note.id,
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 
        : a.completed ? 1 : -1
})
const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getNotes: builder.query<EntityState<Note, string>, void>({
            query: () => ({
                url: '/notes',
                validateStatus: (response, result) => 
                    response.status === 200 && !result.isError,
            }),
            transformResponse: (responseData: Note[]) => {
                const loadedNotes = responseData.map((note) => {
                    note.id = note._id
                    return note
                })
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) : { type: 'Note', id: string }[] => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note' as const, id}))
                    ]
                } else {
                    return [{ type: 'Note', id: 'LIST' }]
                }
            },
        }),

        addNewNote: builder.mutation<Note, Partial<Note>>({
            query: (newNoteData) => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...newNoteData,
                }
            }),
            invalidatesTags: [{ type: 'Note', id: 'LIST' }]
        }),

        updateNote: builder.mutation<Note, Partial<Note>>({
            query: (updateNoteData) => ({
                url: '/notes',
                method: 'PATCH',
                body: { ...updateNoteData }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }]
        }),

        deleteNote: builder.mutation<Note, Partial<Note>>({
            query: ({ id }) => ({
                url: `/notes`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }]
        })

    })
})


export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = notesApiSlice;


const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

const selectNotesData = createSelector(
    selectNotesResult, 
    (notesResult) => notesResult.data
)

export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
} = notesAdapter.getSelectors((state: BaseState) => selectNotesData(state) ?? initialState)

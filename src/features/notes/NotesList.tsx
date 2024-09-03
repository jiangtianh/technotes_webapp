import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";

const NoteList = () => {

    const { username, isManager, isAdmin } = useAuth();
    const {
        data: notes,
        error,
        isLoading,
        isError,
        isSuccess,
    } = useGetNotesQuery(undefined, {
        pollingInterval: 15000, // We want to poll every 15 seconds
        refetchOnFocus: true, // And refetch when the window is focused
        refetchOnMountOrArgChange: true, // And refetch when the component mounts or the arguments change
    })

    let content;
    if (isLoading) {
        content = <p>isLoading</p>
    } else if (isError) {
        let errorMessage;
        if ('status' in error) {
            errorMessage = `Error: ${error.status} ${(error.data as { message: string }).message}`
        } else {
            errorMessage = `Error: ${error}`
        }
        content = <p className='errmsg'>{errorMessage}</p>
    } else if (isSuccess) {
        const { ids, entities } = notes;

        let filteredIds;
        if (isManager || isAdmin) {
            filteredIds = [...ids];
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username);
        }

        const tableContent = ids?.length && filteredIds.map((noteId) => (<Note key={noteId} noteId={noteId} />));

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">Username</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__Title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return (
        <>{content}</>
    )
}
export default NoteList;
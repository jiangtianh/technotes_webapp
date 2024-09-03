import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { BaseState } from "../../app/store";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { PulseLoader } from "react-spinners";

const EditNote = () => {

    const { id } = useParams();

    // const note = useSelector((state: BaseState) => selectNoteById(state, id || ""));
    // const users = useSelector(selectAllUsers);

    const { username, isManager, isAdmin } = useAuth();

    const { note } = useGetNotesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            note: id ? data?.entities[id] : undefined
        })
    })

    const { users } = useGetUsersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!note || !users?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (note?.username !== username) {
            return <p className='errmsg'>No Access</p>
        }
    }

    const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    return content;
}
export default EditNote;
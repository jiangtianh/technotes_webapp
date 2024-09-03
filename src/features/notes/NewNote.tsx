import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

import { useGetUsersQuery } from '../users/usersApiSlice';
import { PulseLoader } from 'react-spinners';

const NewNote = () => {
    const { users } = useGetUsersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    })

    if (!users?.length) return <PulseLoader color={"#FFF"} />

    const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>

    return content;
}
export default NewNote;
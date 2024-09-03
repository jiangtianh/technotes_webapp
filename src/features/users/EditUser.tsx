import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { BaseState } from "../../app/store";
import EditUserForm from "./EditUserForm";

import { useGetUsersQuery } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";

const EditUser = () => {

    const { id } = useParams<{ id: string }>();

    // const user = useSelector((state: BaseState) => id ? selectUserById(state, id) : undefined);

    const { user } = useGetUsersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            user: id ? data?.entities[id] : undefined
        })
    })

    if (!user) return <PulseLoader color={"#FFF"} />

    const content = <EditUserForm user={user} />

    return content;
}
export default EditUser;
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

const UserList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    let content;

    if (isLoading) {
        content = <p>isLoading</p>
    } else if (isError) {
        let errorMessage;
        if ('status' in error) {
            errorMessage = `Error: ${error.status} ${error.data}`
        } else {
            errorMessage = `Error: ${error}`
        }
        content = <p className='errmsg'>{errorMessage}</p>
    } else if (isSuccess) {
        const { ids } = users;

        const tableContent = ids?.length
            ? ids.map((userId) => (<User key={userId} userId={userId} />))
            : null;

        content = (
            <table className="table table--users">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th user__username">Username</th>
                        <th scope="col" className="table__th user__roles">Roles</th>
                        <th scope="col" className="table__th user__edit">Edit</th>
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
export default UserList;
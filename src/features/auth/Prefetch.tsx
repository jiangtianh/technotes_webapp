import store from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { userApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

//This page exist because for example when we edit a user in the EditUser component, 
// we are using selectors to get the user from the store, which means that RTK query will not be able to create a subscription
// So we create this prefetch component to prefetch all the users and notes for mannual subscription
const Prefetch = () => {
    useEffect(() => {

        store.dispatch(notesApiSlice.util.prefetch('getNotes', undefined, { force: true }));
        store.dispatch(userApiSlice.util.prefetch('getUsers', undefined, { force: true }));

    }, [])
    return <Outlet />
}
export default Prefetch;
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";


const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const navigate = useNavigate();

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();

    useEffect(() => {
        console.log('persist login');
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // This is here due to react strict mode as we only want this to be run once
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token');
                try {
                    const response = await refresh();
                    console.log('responseFromRefresh:', response);
                    setTrueSuccess(true);
                    console.log('trueSuccess:', trueSuccess);
                } catch (err: any) {
                    console.log(err);
                }
            }
            if (!token && persist) {
                verifyRefreshToken();
            }
        }
        return () => {
            console.log(effectRan.current);
            effectRan.current = true;
        }
    }, [])


    let content;
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {`${JSON.stringify(error)} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    } else {
        console.log('else')
        content = <p>Something went wrong</p>
    }

    return content
}

export default PersistLogin;


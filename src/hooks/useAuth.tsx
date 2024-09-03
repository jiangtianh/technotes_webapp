import { useSelector, UseSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    UserInfo: {
        username: string;
        roles: string[];
    }
}
interface AuthState {
    username: string;
    roles: string[];
    isManager: boolean;
    isAdmin: boolean;
    status: string;
}

const useAuth = (): AuthState => {
    const token = useSelector(selectCurrentToken);
    let isManager = false;
    let isAdmin = false;
    let status = 'Employee';

    if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const { username, roles } = decoded.UserInfo
        isManager = roles.includes('Manager');
        isAdmin = roles.includes('Admin');

        if (isManager) status = 'Manager';
        if (isAdmin) status = 'Admin';

        return { username, roles, isManager, isAdmin, status };
    }

    return { username: '', roles: [], isManager, isAdmin, status };
}

export default useAuth


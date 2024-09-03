import { useState, useEffect } from "react";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import { UserType } from "./usersApiSlice";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;


const EditUserForm = ({ user }: { user: UserType }) => {

    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation();
    const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delError }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
        if (isDelSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value) };
    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value) };
    const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    }
    const onActiveChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setActive(prev => !prev) };

    const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active });
        } else {
            await updateUser({ id: user.id, username, roles, active });
        }
    }

    const onDeleteUserClicked = async () => {
        console.log('delete user');
        const result = await deleteUser({ id: user.id });
        console.log(result);
    }

    let canSave;
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
    }

    const options = Object.values(ROLES).map((role) => {
        return (
            <option key={role} value={role}>{role}</option>
        )
    })

    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen';
    const validUserClass = !validUsername ? 'form__input--incomplete' : '';
    const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';

    const errContent = isError && error
        ? 'status' in error
            ? `${error.status} ${JSON.stringify(error.data)}`
            : error.message
        : isDelError && delError
            ? 'status' in delError
                ? `${delError.status} ${JSON.stringify(delError.data)}`
                : delError.message
            : '';

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            type="submit"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            type="button"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="isername">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span>
                </label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    Active:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size={3}
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )

    return content;
}

export default EditUserForm;
import { UserType } from "../users/usersApiSlice";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNodeForm = ({ users }: { users: UserType[] }) => {
    const [addNewNote, { isLoading, isSuccess, isError, error }] = useAddNewNoteMutation();
    
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (isSuccess) {
            setTitle('');
            setText('');
            setUserId(undefined);
            navigate('/dash/notes');
        }
    }, [isSuccess, navigate])

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value) };
    const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setText(e.target.value) };
    const onUserChanged = (e: React.ChangeEvent<HTMLSelectElement>) => { setUserId(e.target.value) };

    const canSave = [title, text, userId].every(Boolean);

    const onSaveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (canSave) {
            const user = userId !== null ? userId : undefined;
            await addNewNote({ title, text, user });
        }
    }

    const userOptions = users.map((user) => {
        return (
            <option key={user.id} value={user.id}>{user.username}</option>
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validTitleClass = !title ? "form__input--incomplete" : ''
    const validTextClass = !text ? "form__input--incomplete" : ''

    return (
        <>
            {
                isError && error
                ? 'status' in error 
                    ? <p className={errClass}>{error.status} {JSON.stringify(error.data)}</p>
                    : <p className={errClass}>{error.name} {error.message}</p>
                : null
            }

            <form className="form" onSubmit={onSaveNoteClicked}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button 
                            className="icon-button"
                            title="Save"
                            type="submit"
                            disabled={!canSave || isLoading}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="text">
                    Text:
                </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:
                </label>
                <select
                    id="username"
                    name="username"
                    value={userId}
                    onChange={onUserChanged}
                >   
                    <option value={undefined}>-</option>
                    {userOptions}
                </select>
            </form>
        </>
    );
}

export default NewNodeForm;
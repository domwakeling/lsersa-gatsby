import React, { useState, useEffect } from "react";
import LoadingSpinner from "../elements/LoadingSpinner";
import AdminUserListItem from "./AdminUserListItem";
import AdminUserDetail from "./AdminUserDetail";
import { MESSAGE_CLASSES } from "../../../lib/constants";
import { MANAGE_MODES } from "../../../lib/modes";

const AdminManageUsers = ({ displayMessage }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState(MANAGE_MODES.LIST);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        async function initialRetrieveUsers() {
            setIsLoading(true);
            const result = await fetch(`/api/admin/users`);
            if (result.status === 200) {
                const data = await result.json();
                setUsers(data);
                setFilteredUsers(data);
            } else {
                // likely status 400, but error regardless
                setUsers([]);
                setFilteredUsers([]);
                displayMessage(MESSAGE_CLASSES.WARN, "Unable to retrieve users");
            }
            setIsLoading(false);
        }

        initialRetrieveUsers();
    }, [displayMessage])

    const selectUserCallback = (id) => {
        setSelectedUserId(id);
        setMode(MANAGE_MODES.DETAIL);
    }

    const refilterUsers = (currentFilter, userArray = users) => {
        if (currentFilter !== '') {
            const reg = new RegExp(currentFilter, "i");
            let tempArr = JSON.parse(JSON.stringify(userArray));
            tempArr = tempArr.filter(user => (
                reg.test(user.email) || reg.test(`${user.first_name} ${user.last_name}`)
            ))
            setFilteredUsers(tempArr);
        } else {
            setFilteredUsers(users);
        }
    }

    const handleFilterChange = (e) => {
        e.preventDefault();
        const newFilter = e.target.value;
        setFilterText(newFilter);
        refilterUsers(newFilter);
    }

    const handleUserDetailSubmit = async (update) => {
        if(Object.keys(update.updates).length === 0) {
            displayMessage(MESSAGE_CLASSES.ALERT, "Update made no changes")
            return;
        }
        const res = await fetch(`/api/admin/users`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(update),
        });
        if (res.status === 200) {
            // update the user array in memory (don't want to call it back again)
            const tempArr = JSON.parse(JSON.stringify(users));  // ensure we have a copy
            const idx = tempArr.map(user => user.id).indexOf(update.id);
            const keys = Object.keys(update.updates);
            for (const key of keys) {
                tempArr[idx][key] = update.updates[key];
            }
            setUsers(tempArr);
            // run the filter again in case something has changed
            refilterUsers(filterText, tempArr);
            // back to list view
            setMode(MANAGE_MODES.LIST);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "User updated");
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    const handleUserDetailCancel = () => {
        setMode(MANAGE_MODES.LIST);
        setSelectedUserId(null);
    }

    const handleUserDetailDelete = async (id) => {
        const body = {id}
        const res = await fetch(`/api/admin/users`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.status === 200) {
            // update the user array in memory (don't want to call it back again)
            let tempArr = JSON.parse(JSON.stringify(users));  // ensure we have a copy
            // filter out the user we've just deleted
            tempArr = tempArr.filter(user => user.id !== id);
            setUsers(tempArr);
            // run the filter again in case something has changed
            refilterUsers(filterText, tempArr);
            // back to list view
            setMode(MANAGE_MODES.LIST);
            displayMessage(MESSAGE_CLASSES.SUCCESS, "User deleted");
        } else {
            const data = await res.json();
            displayMessage(MESSAGE_CLASSES.WARN, data.message);
        }
    }

    return (
        <>
            <h3>Admin Manage Users</h3>
            {isLoading && <LoadingSpinner />}
            {mode === MANAGE_MODES.LIST && !isLoading && (
                <>
                    <h4>filter</h4>
                    <input
                        type="text"
                        onChange={handleFilterChange}
                        value={filterText}
                        placeholder="search filter"
                    />
                    <br />
                    <div className="pane-container">
                        {filteredUsers.slice(0,10).map((user, idx) => (
                            <AdminUserListItem
                                key={idx}
                                user={user}
                                setDetailUserId={selectUserCallback}
                            />
                        ))}
                    </div>
                    {filteredUsers.length > 10 && (
                        <p>First 10 results showing, use filters to refine list.</p>
                    )}
                </>
            )}
            {mode === MANAGE_MODES.DETAIL && !isLoading && (
                <AdminUserDetail
                    user={users.filter(user => user.id === selectedUserId)[0]}
                    handleUserDetailSubmit={handleUserDetailSubmit}
                    handleUserDetailCancel={handleUserDetailCancel}
                    handleUserDetailDelete={handleUserDetailDelete}
                />
            )}
        </>
    )
}

export default AdminManageUsers;
const updateUserDetails = async (user, newUser) => {
    
    const newKeys = Object.keys(newUser);
    const updateDetails = {};
    newKeys.forEach(key => {
        if (newUser[key] !== user[key]) updateDetails[key] = newUser[key];
    })
    
    const body = {
        id: user.id,
        identifier: user.identifier,
        updates: updateDetails
    }

    const res = await fetch(`/api/user/updateuserdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    return res;
}

export default updateUserDetails;

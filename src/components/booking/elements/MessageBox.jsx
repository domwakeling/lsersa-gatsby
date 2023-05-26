import React from "react";

const MessageBox = ({ message, messageClass}) => {

    return (
        <>
            { message && message !== '' && (
                <div className={messageClass}>
                    <p>{message}</p>
                </div>
            )}
        </>
    )
}

export default MessageBox;
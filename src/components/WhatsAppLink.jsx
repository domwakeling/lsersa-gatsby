import React from "react";

const WhatsAppLink = () => {

    const today = new Date();
    // day AFTER the race
    const raceDayCutoff = new Date('2024-05-05');
    const url ="https://chat.whatsapp.com/BubUFKrhZmc8f8wW0x5WJc";

    return (
        <>
        { today <= raceDayCutoff ? (
            <div>
                <div className="advice-box">
                    <p>A WhatsApp Group has been set up for this weekend's race, please
                        {" "}
                        <a href={url} target="_whatsapp">join the group</a> to keep up-to-date.
                    </p>
                </div>
                <br />
            </div>
        ) : ''}
        </>
    )
}

export default WhatsAppLink;
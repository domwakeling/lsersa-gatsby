const gen = () => Math.floor(Math.random() * 36).toString(36);

const token = (tokenLength = 16) => {
    let ret = "";
    for (let i = 0; i < tokenLength; i++) {
        ret = ret + gen();
    }
    return ret;
}

export {
    token
}
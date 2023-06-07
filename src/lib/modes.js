const MODES = {
    ADMIN: 0,
    LOGGED_IN: 1,
    LOGGING_IN: 2,
    SIGNING_UP: 3,
    PASSWORD_RESET_REQUEST: 4,
    PASSWORD_REQUEST_HANDLE: 5,
    LOADING: 6,
    LOGGING_OUT: 7
}

const ADMIN_MODES = {
    MANAGE_OWN_BOOKINGS: 0,
    MANAGING_OWN_RACERS: 1,
    MANAGING_OWN_DETAILS: 2,
    REVIEW_REQUESTS: 3,
    MANAGE_SESSION: 4,
    SEND_EMAIL: 5,
    INVITE_USER: 6,
    MANAGE_ACCOUNT: 7,
    MANAGE_RACERS: 8,
    MANAGE_CLUBS: 9,
}

const USER_MODES = {
    BOOKING: 0,
    ADDING_RACER: 1,
    MANAGING_DETAILS: 2
}

const MANAGE_MODES = {
    LIST: 0,
    DETAIL: 1,
    ADD: 2
}

const COMPLETING_MODES = {
    LOADING: 0,
    INVALID_TOKEN: 1,
    NO_TOKEN: 2,
    TOKEN_FOUND: 3,
    SUBMIT_GOOD: 4,
    SUBMIT_BAD: 5,
}

export {
    ADMIN_MODES,
    COMPLETING_MODES,
    MANAGE_MODES,
    MODES,
    USER_MODES
}
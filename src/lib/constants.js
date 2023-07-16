const MESSAGE_CLASSES = {
    SUCCESS: "success-box",
    ALERT: "alert-box",
    WARN: "warn-box"
}

const MESSAGE_TIME = 5000;

const SESSION_MAX = 30;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'];

const STYLES = {
    redText: {
        color: "red"
    }
}

const EMAIL_BATCH_SIZE = 40;

module.exports = {
    EMAIL_BATCH_SIZE,
    MESSAGE_CLASSES,
    MESSAGE_TIME,
    SESSION_MAX,
    WEEKDAYS,
    MONTHS,
    STYLES
}
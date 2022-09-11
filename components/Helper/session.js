export const getSessionItem = (key) => {
    return sessionStorage.getItem(key);
}

export const setSessionItem = (key, value) => {
    sessionStorage.setItem(key, value);
}

export const removeSessionItem = (key) => {
    sessionStorage.removeItem(key);
}
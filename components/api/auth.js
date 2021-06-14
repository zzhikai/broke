import firebase from "./firebase";

const auth = firebase.auth();

export const getCurrentUserId = () => auth.currentUser ? auth.currentUser.uid : null;

export const getCurrentUserName = () => auth.currentUser ? auth.currentUser.displayName : null;

export const setOnAuthStateChanged = (callback) => auth.onAuthStateChanged((user) => {
    if (user) {
        return callback(true);
    } else {
        return callback(false);
    }
});
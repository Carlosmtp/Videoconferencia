import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.config.ts";
import { query, where } from "firebase/firestore";

const usersRef = collection(db, "users")

const createUser = async (userData) => {
    try {
        await addDoc(usersRef, userData)
    } catch (error) {
        console.error("Error adding document: ", error)
    }
}

const readUser = async (userEmail) => {
    try {
        const userSnapshot = await getDocs(
            query(usersRef, where("email", "==", userEmail))
        );
        if (userSnapshot.empty) {
            return { sucess: false, message: "No user found" }
        }
        const userData = userSnapshot.docs.map((doc) => doc.data());
        console.log(userData)
        return { sucess: true, data: userData }
    } catch (error) {
        return { sucess: false, message: error }
    }
}

export { createUser, readUser }
import { addDoc, collection, getDocs, query, where, runTransaction, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config.ts";

const usersRef = collection(db, "users");

const createUser = async (userData: { email: string; displayName: string | null; photoURL: string | null }) => {
    try {
        const userSnapshot = await getDocs(
            query(usersRef, where("email", "==", userData.email))
        );

        if (!userSnapshot.empty) {
            return { success: false, message: "User already exists" };
        }

        await runTransaction(db, async (transaction) => {
            const userDocRef = doc(usersRef, userData.email); // Usar el email como ID
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                transaction.set(userDocRef, userData);
            }
        });

        return { success: true, message: "User created successfully" };
    } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, message: error.message };
    }
}

const readUser = async (userEmail: string) => {
    try {
        const userSnapshot = await getDocs(
            query(usersRef, where("email", "==", userEmail))
        );
        if (userSnapshot.empty) {
            return { success: false, message: "No user found" };
        }
        const userData = userSnapshot.docs.map((doc) => doc.data());
        return { success: true, data: userData[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

const editUser = async (userEmail: string, userData: { displayName?: string; photoURL?: string }) => {
    try {
        const userSnapshot = await getDocs(
            query(usersRef, where("email", "==", userEmail))
        );
        if (userSnapshot.empty) {
            return { success: false, message: "No user found" };
        }
        const userDoc = userSnapshot.docs[0];
        await updateDoc(userDoc.ref, userData);
        return { success: true, message: "User updated" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export { createUser, readUser, editUser };

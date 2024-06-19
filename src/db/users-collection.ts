import { addDoc, collection, getDocs, updateDoc, query, where, runTransaction, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.config.ts";

const usersRef = collection(db, "users");

type UserData = {
    email: string;
    displayName: string | null;
    photoURL: string | null;
};

const createUser = async (userData: UserData): Promise<{ success: boolean; message: string }> => {
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

const readUser = async (userEmail: string): Promise<{ success: boolean; data?: UserData; message?: string }> => {
    try {
        const userSnapshot = await getDocs(
            query(usersRef, where("email", "==", userEmail))
        );
        if (userSnapshot.empty) {
            return { success: false, message: "No user found" };
        }
        const userData = userSnapshot.docs.map((doc) => doc.data() as UserData);
        return { success: true, data: userData[0] };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

const editUser = async (userEmail: string, userData: Partial<UserData>): Promise<{ success: boolean; message: string }> => {
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

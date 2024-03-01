import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        
        if(!newAccount) throw new Error("Account not created");

        const avatarUrl = await avatars.getInitials(user.name);
        console.log(17, avatarUrl)
        const newUser = await saveUserToDB({
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            accountId: newAccount.$id,
            imageUrl: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.log(28,error);

        return error;
    }
}
// 
export async function saveUserToDB(user: {
    name: string;
    email: string;
    username?: string;
    accountId: string;
    imageUrl: URL;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            ID.unique(),
            user,
        )

        return newUser;
    } catch (error) {
        console.log(51, error);
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw new Error("No user found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if(!currentUser) throw new Error("No user found");
        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
        return error;
    }
}
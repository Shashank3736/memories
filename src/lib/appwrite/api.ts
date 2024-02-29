import { INewUser } from "@/types";
import { ID } from "appwrite";
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

        const newUser = await saveUserToDB({
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            accountId: newAccount.$id,
            imageUrl: avatarUrl
        })

        return newUser;
    } catch (error) {
        console.error(error);
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
        console.log(error);
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
        return error;
    }
}
import { INewPost, INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

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

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.error(error);
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload image to storage media
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw new Error("File not uploaded");

        // Get file url
        const fileUrl = await getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw new Error("File not found");
        }

        // Convert tags in an array
        const tags = post.tags?.replace(/ /g, "").split(",");

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            ID.unique(),
            {
                caption: post.caption,
                tags: tags,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                creators: post.userId,
                location: post.location
            }
        )

        if(!newPost) {
            await deleteFile(uploadedFile.$id);
            throw new Error("Post not created");
        }

        return newPost;
    } catch (error) {
        console.error(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const media = await storage.createFile(
            appwriteConfig.storageID,
            ID.unique(),
            file
        );
        return media;
    } catch (error) {
        console.error(error);
    }
}

export async function getFilePreview(fileId: string) {
    try {
        const fileUrl = await storage.getFilePreview(
            appwriteConfig.storageID,
            fileId,
            2000,
            2000,
            'top',
            100
        );
        return fileUrl;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(
            appwriteConfig.storageID,
            fileId
        );
        return { status: "ok" };
    } catch (error) {
        console.error(error);
    }
}
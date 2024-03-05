import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            queries
        )

        if(!posts) throw new Error("No posts found");
        return posts;
    } catch (error) {
        console.log(error)
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw new Error("No posts found");
        return posts;
    } catch (error) {
        console.log(error)
    }
}

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

export async function getRecentPosts() {
    try {
        const recentPosts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            [Query.orderDesc("$createdAt"), Query.limit(20)],
        )

        if(!recentPosts) throw new Error("No posts found");
        return recentPosts;
    } catch (error) {
        console.error(error);
    }
}

export async function likePost(postId: string, userId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId
        )

        if(!post) throw new Error("Post not found");

        let likeList = post.likes.map((user: Models.Document) => user.$id);
        
        if(likeList.includes(userId)) {
            console.log(168, likeList, userId)
            likeList = likeList.filter((id: string) => id !== userId);
        } else {
            likeList.push(userId);
        }

        console.log(174, likeList, userId)

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId,
            {
                likes: likeList
            }
        )

        if(!updatedPost) throw new Error("Post not updated");

        return updatedPost;
    } catch (error) {
        console.error(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const savedPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.savesCollectionID,
            ID.unique(),
            {
                post: postId,
                user: userId
            }
        )

        if(!savedPost) throw new Error("Post not saved");

        return savedPost;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const deletedPost = await databases.deleteDocument(
            appwriteConfig.databaseID,
            appwriteConfig.savesCollectionID,
            savedRecordId
        )

        if(!deletedPost) throw new Error("Post not deleted");

        return { status: "ok" };
    } catch (error) {
        console.error(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId
        )

        return post
    } catch (error) {
        console.log(error)
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseID,
            appwriteConfig.userCollectionID,
            userId
        )

        return user
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {
        const image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0]);
    
            if(!uploadedFile) throw new Error("File not uploaded");
    
            // Get file url
            const fileUrl = await getFilePreview(uploadedFile.$id);
    
            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw new Error("File not found");
            }

            image.imageUrl = fileUrl;
            image.imageId = uploadedFile.$id;
        }
        // Upload image to storage media

        // Convert tags in an array
        const tags = post.tags?.replace(/ /g, "").split(",");

        // Save post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            post.postId,
            {
                caption: post.caption,
                tags: tags,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location
            }
        )

        if(!updatedPost) {
            await deleteFile(post.imageId);
            throw new Error("Post not created");
        }

        return updatedPost;
    } catch (error) {
        console.error(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw new Error("Missing Arguments");
    try {
        const deletedPost = await databases.deleteDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postCollectionID,
            postId
        )

        if(!deletedPost) throw new Error("Post not deleted");

        await deleteFile(imageId);

        return { status: "ok" };
    } catch (error) {
        console.error(error);
    }
}

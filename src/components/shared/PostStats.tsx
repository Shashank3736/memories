import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";

type PostStatsProps = {
    post: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id)
  const { data: currentUser } = useGetCurrentUser()

  const [ likes, setLikes ] = useState(likesList);
  const [ isSaved, setIsSaved ] = useState(false);

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost } = useSavePost()
  const { mutate: deleteSavedPost } = useDeleteSavedPost()

  useEffect(() => {
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);
    setIsSaved(!!savedPostRecord);
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if(hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, userId });
  }
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    if(savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  }

  return (
    <div className="flex justify-between z-20 items-center">
        <div className="flex gap-2">
            <img 
            src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            className="cursor-pointer" />
            <p>{likes.length}</p>
        </div>
        <div className="flex gap-2">
            <img 
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer" />
        </div>
    </div>
  )
}

export default PostStats
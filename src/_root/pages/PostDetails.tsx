import Loader from "@/components/shared/Loader"
import PostStats from "@/components/shared/PostStats"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { multiFormatDateString } from "@/lib/utils"
import { Link, useNavigate, useParams } from "react-router-dom"

const PostDetails = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  const { mutate: deletePost } = useDeletePost()
  const { user } = useUserContext()
  const navigate = useNavigate()

  const handleDeletePost = () => {
    try {
      if(!post) return
      deletePost({ postId: post?.$id, imageId: post?.imageId})
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="post_details-container">
      {isPending ? <Loader /> : post ? (
        <div className="post_details-card p-5 gap-5 w-full">
          <img 
          src={post?.imageUrl} alt="photo" className="rounded-xl lg:max-w-[50%] object-contain" />
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between w-full">
              <div className="flex gap-4">
                <Link to={`/profile/${post.creators?.$id}`}>
                  <img
                  className="rounded-full w-12 h-12" 
                  src={post?.creators?.imageUrl || "/assets/icons/profile-placeholder.svg"} 
                  alt="profile icon" />
                </Link>

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creators?.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post.$createdAt)}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post.location}</p>
                  </div>
                </div>
              </div>

              {user?.id === post.creators?.$id && (
                <div className="flex flex-row justify-center">
                  <Link to={`/update-post/${post.$id}`}>
                      <img src="/assets/icons/edit.svg" className="py-2" alt="edit" width={20} height={20} />
                  </Link>
                  <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className="">
                    <img src="/assets/icons/delete.svg" alt="delete" width={20} height={20} />
                  </Button>
                </div>
              )}
            </div>
            <hr className="border border-dark-4/80 w-full" />

            <div className="small-medium lg:base-medium">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      ): "Post not found"}
    </div>
  )
}

export default PostDetails
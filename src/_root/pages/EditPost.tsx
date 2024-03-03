import PostForm from "@/components/forms/PostForm"
import Loader from "@/components/shared/Loader"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"

const EditPost = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')

  if (isPending) return <Loader />

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
          src="/assets/icons/add-post.svg" 
          alt="add" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit post</h2>
        </div>
        <PostForm action="update" post={post} />
      </div>
    </div>
  )
}

export default EditPost
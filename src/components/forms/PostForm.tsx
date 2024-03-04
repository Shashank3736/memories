import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
  post?: Models.Document
  action?: 'create' | 'update'
}

const PostForm = ({ post, action="create" }: PostFormProps) => {
  const { mutateAsync: createPost, isPending:isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isPending:isLoadingUpdate } = useUpdatePost()

  const { user } = useUserContext()
  const navigate = useNavigate()
  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags.join(',') || "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(post && action === 'update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post?.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if(!updatedPost) {
        return toast({
          title: 'Please Try Again',
        })
      }
      return navigate(`/posts/${post?.$id}`)
    }

    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if(!newPost) {
      return toast({
        title: 'Please Try Again',
      })
    }
    
    navigate('/')
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl} 
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Add Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Add tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (Seperated by comma(,))</FormLabel>
              <FormControl>
                <Input className="shad-input" {...field} placeholder="arts, movies, nature etc" />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">Cancel</Button>
            <Button disabled={isLoadingCreate || isLoadingUpdate} type="submit" className="shad-button_primary whitespace-nowrap">{action == "create" ? 'Create': "Update"} Post</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
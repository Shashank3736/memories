import { UpdateProfileValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Models } from 'appwrite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type UpdateProfileProps = {
  user: Models.Document;
}

const UpdateProfileForm = ({ user }: UpdateProfileProps) => {

  // 1. Define your form.
  const form = useForm<z.infer<typeof UpdateProfileValidation>>({
    resolver: zodResolver(UpdateProfileValidation),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      file: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UpdateProfileValidation>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        {/* Profile Image */}
        {/* @todo wip */}
        {/* Name */}
        <FormField 
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Name</FormLabel>
            <FormControl>
              <Input type='text' className='shad-input' {...field} />
            </FormControl>
          </FormItem>
        )}
        />
        {/* Username */}
        <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Username</FormLabel>
            <FormControl>
              <Input type='text' className='shad-input' {...field} />
            </FormControl>
          </FormItem>
        )}
        />
        {/* Bio */}
        <FormField
        control={form.control}
        name='bio'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Bio</FormLabel>
            <FormControl>
              <Textarea className='shad-input' {...field} />
            </FormControl>
          </FormItem>
        )}
        />
      </form>
    </Form>
  )
}

export default UpdateProfileForm
import UpdateProfileForm from '@/components/forms/UpdateProfileForm';
import { useUserContext } from '@/context/AuthContext';
import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom'

const UpdateProfile = () => {
  const { id } = useParams<{id: string}>();
  const { data: user } = useGetUserById(id || '');
  const { user: currentUser } = useUserContext();
  
  if(!user || !currentUser) return <div>Loading...</div>
  if(user.$id !== currentUser.id) return <div>Not Authorized</div>


  return (
    <div className='container py-4 md:py-20 gap-10'>
      <div className='flex gap-4 mb-4 md:mb-12'>
        <img src="/assets/icons/edit.svg" width={40} height={40} alt="edit" className='invert-white' />
        <h1 className='h2-bold md:h1-bold'>Edit Profile</h1>
      </div>
      {/* Form to edit profile */}
      <UpdateProfileForm user={user} />
    </div>
  )
}

export default UpdateProfile
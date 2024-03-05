import GridPostList from '@/components/shared/GridPostList'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const Profile = () => {
  const { id } = useParams<{ id: string }>()

  const { user: currentUser } = useUserContext()

  const { data:user } = useGetUserById(id || '');
  console.log(user)

  if(!user) return <div>Loading...</div>

  return (
    <div className='p-8'>
      <div className='flex gap-4 pb-8 w-full'>
        <div className='w-30'>
          <img className='w-24 h-24 rounded-full' src={user.imageUrl} alt="profile" />
        </div>
        <div className=''>
          <div className='flex justify-between gap-4 w-full'>
            <div>
              <h1 className='h2-bold md:h1-bold font-sans'>{user.name}</h1>
              <p className=' text-light-3'>@{user.username}</p>
            </div>
            {user.$id === currentUser.id && (
            <Link to={`/update-profile/${user.$id}`} className='flex h-10 items-center mt-3 p-2 hover:border rounded-lg bg-dark-4 gap-3'>
              <img src="/assets/icons/edit.svg" width={25} height={25} alt="edit" />
              <p className='hidden md:block font-bold'>Edit Profile</p>
            </Link>)}
          </div>
          <div className='py-4 w-fit'>
            <h1 className='text-[#877EFF] text-2xl text-center'>{user.posts.length}</h1>
            <p>Posts</p>
          </div>
          {user.bio ? <p>{user.bio}</p> : <p className='text-light-3'>No bio</p>}
        </div>
      </div>
      <GridPostList posts={user.posts} creator={user} />
    </div>
  )
}

export default Profile
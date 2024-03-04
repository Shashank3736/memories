import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react'
import { useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import Logo from './Logo'

const LeftSidebar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount()
    const navigate = useNavigate()
    const { user } = useUserContext()
    const { pathname } = useLocation()

    useEffect(() => {
        if (isSuccess) {
            navigate('/sign-in')
        }
    },[isSuccess])
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
      <Link to='/' className='flex gap-3 items-center'>
        <Logo />
      </Link>
      
      {/* Link to profile */}
      <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
        <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className='h-14 w-14 rounded-full' />
        <div className="flex flex-col">
          <p className="body-bold">
            {user.name}
          </p>
          <p className="small-regular text-light-3">
            @{user.username}
          </p>
        </div>
      </Link>
      <ul className="flex flex-col gap-6">
        {/* Sidebar links */}
        {sidebarLinks.map((link: INavLink, index) => {
          const isActive = pathname === link.route
          return (
          <li key={index} className={`leftsidebar-link ${isActive && 'bg-primary-500'} group`}>
            <NavLink to={link.route} className="flex gap-4 p-4 items-center">
              <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
              <p className="body-regular">{link.label}</p>
            </NavLink>
          </li>
        )}
        )}
      </ul>
      </div>
      <Button variant="ghost" className='shad-button_ghost' onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">
          Logout
        </p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
import { bottombarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Link, useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation()
  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link: INavLink, index) => {
          const isActive = pathname === link.route
          return (
            <Link key={index} className={`bottombar-link p-2 transition flex-center flex-col gap-1 ${isActive && 'bg-primary-500 rounded-[10px]'} group`} to={link.route}>
              <img 
              src={link.imgURL} 
              alt={link.label} 
              className={`${isActive && 'invert-white'}`}
              width={16}
              height={16} />
              <p className="tiny-medium text-light-2">{link.label}</p>
            </Link>
        )}
        )}
    </section>
  )
}

export default Bottombar
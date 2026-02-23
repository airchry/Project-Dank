import { Link, useLocation } from 'react-router-dom'
import {
  Skull,
  Gamepad2,
  ImageIcon,
  Rss,
  Users,
  LogIn,
  LogOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../Api'

type NavLinkProps = {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
  active: boolean
}

function NavLink({ to, icon, children, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all border
        ${active
          ? 'bg-pink-500/20 border-pink-500/30'
          : 'border-transparent hover:bg-pink-500/10'}
      `}
    >
      <span className={active ? 'text-pink-400' : 'text-gray-400'}>
        {icon}
      </span>
      <span className={active ? 'text-pink-400' : 'text-gray-400'}>
        {children}
      </span>
    </Link>
  )
}

function Navbar() {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    api
      .get('/auth/check', { withCredentials: true })
      .then(res => setIsLoggedIn(res.data.loggedIn))
      .catch(() => setIsLoggedIn(false))
  }, [])

  const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`
  }

  return (
    <header className="border-b border-pink-900/30 backdrop-blur-sm bg-black/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <Skull className="w-8 h-8 text-pink-500 group-hover:text-pink-400 transition-colors" />
            <div>
              <h1 className="text-sm metal-slug-title text-pink-500 group-hover:text-orange-400 transition-colors">
                DANK MEME
              </h1>
              <p className="text-xs text-gray-500">Co-op Chaos Hub</p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" icon={<Skull className="w-4 h-4" />} active={isActive('/')}>
                Home
              </NavLink>
              <NavLink to="/games" icon={<Gamepad2 className="w-4 h-4" />} active={isActive('/games')}>
                Games Hall
              </NavLink>
              <NavLink to="/vault" icon={<ImageIcon className="w-4 h-4" />} active={isActive('/vault')}>
                Vault
              </NavLink>
              <NavLink to="/feed" icon={<Rss className="w-4 h-4" />} active={isActive('/feed')}>
                Feed
              </NavLink>
              <NavLink to="/crew" icon={<Users className="w-4 h-4" />} active={isActive('/crew')}>
                Crew
              </NavLink>
            </nav>

            {/* AUTH BUTTON */}
            {isLoggedIn !== null && (
              isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="
                    hidden md:flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                    border border-pink-500/30
                    bg-pink-500/10 text-pink-400
                    hover:bg-pink-500/30 hover:text-white
                    transition
                  "
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <a
                  href={import.meta.env.VITE_DISCORD_AUTH}
                  className="
                    hidden md:flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                    border border-pink-500/30
                    bg-pink-500/10 text-pink-400
                    hover:from-pink-600/40 hover:to-purple-600/40
                    hover:text-white
                    transition
                  "
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

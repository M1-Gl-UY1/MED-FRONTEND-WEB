import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  LogOut,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import logoMed from '../../assets/logo_med_sans_fond.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Automobiles', href: '/catalogue?type=AUTOMOBILE' },
    { name: 'Scooters', href: '/catalogue?type=SCOOTER' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('?')[0]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100/50">
      <div className="container">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logoMed}
              alt="MED Auto"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="text-lg sm:text-xl font-bold text-primary hidden sm:block">
              MED Auto
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium py-2 transition-colors hover:text-secondary',
                  isActive(item.href) ? 'text-secondary' : 'text-content-light'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="input w-56 xl:w-64 h-11 text-sm pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 text-content-muted hover:text-content p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notifications - uniquement pour utilisateurs connectes */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsNotifOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-20 max-h-96 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-secondary hover:underline"
                          >
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-72">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-content-muted text-sm">
                            Aucune notification
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notif, index) => (
                            <div
                              key={notif.id || index}
                              onClick={() => {
                                if (notif.id && !notif.lu) markAsRead(notif.id);
                                setIsNotifOpen(false);
                              }}
                              className={cn(
                                "px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors",
                                !notif.lu && "bg-blue-50/50"
                              )}
                            >
                              <p className="font-medium text-sm text-primary">{notif.titre}</p>
                              <p className="text-xs text-content-muted mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-content-light mt-1">{notif.tempsEcoule || 'A l\'instant'}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart */}
            <Link
              to="/panier"
              className="relative w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 h-11 px-3 text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium max-w-24 truncate">
                    {user?.type === 'CLIENT'
                      ? user.prenom
                      : user?.nom.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isProfileOpen && "rotate-180"
                  )} />
                </button>

                {isProfileOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <Link
                        to="/profil"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-content hover:bg-primary-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-content-muted" />
                        Mon profil
                      </Link>
                      <Link
                        to="/mes-commandes"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-content hover:bg-primary-50 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5 text-content-muted" />
                        Mes commandes
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button asChild to="/connexion" size="sm">
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications mobile - uniquement pour utilisateurs connectes */}
            {isAuthenticated && (
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart */}
            <Link
              to="/panier"
              className="relative w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-5 h-5 px-1 bg-secondary text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-11 h-11 flex items-center justify-center text-content-light hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un véhicule..."
                  className="input pr-12"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-content-muted hover:text-primary rounded-lg"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            {/* Mobile Navigation */}
            <nav className="space-y-1 mb-4">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center h-12 px-4 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-secondary-50 text-secondary'
                      : 'text-content hover:bg-primary-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Profile Section */}
            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to="/profil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 h-12 px-4 text-sm text-content hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5 text-content-muted" />
                    Mon profil
                  </Link>
                  <Link
                    to="/mes-commandes"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 h-12 px-4 text-sm text-content hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-content-muted" />
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 h-12 px-4 text-sm text-error hover:bg-red-50 rounded-lg w-full transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Button asChild to="/connexion" fullWidth onClick={() => setIsMenuOpen(false)}>
                  Connexion
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

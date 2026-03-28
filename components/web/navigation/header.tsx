'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/commons/ThemeToggle';
import { Authenticated, Unauthenticated } from 'convex/react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  {
    name: 'Products',
    path: '/products',
    submenu: [
      { name: 'Pistons', path: '/pistons' },
      { name: 'Piston Pins', path: '/pistonpins' },
      { name: 'Piston Rings', path: '/pistonrings' },
      { name: 'Cylinder Liners', path: '/cylinderliners' },
    ],
  },
  { name: 'Quality', path: '/quality' },
  { name: 'Blog', path: '/blog' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-background'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 bg-muted">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1689936685/logo_jjwhbb.png"
            alt="meghdoot logo"
            width={70}
            height={70}
            className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 md:w-12.5 md:h-12.5"
            priority
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:block"
          >
            <span className="text-2xl font-semibold font-sans">Meghdoot</span>
            <span className="text-2xl font-semibold text-primary font-sans ml-2">
              Pistons
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            if (item.submenu) {
              return (
                <DropdownMenu key={item.path}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center text-sm font-medium transition-colors hover:text-primary',
                        pathname.startsWith(item.path)
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link
                          href={subItem.path}
                          className={cn(
                            'w-full',
                            pathname === subItem.path ? 'text-primary' : ''
                          )}
                        >
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative',
                  pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:hidden">
              <Unauthenticated>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'h-8 w-8',
                      userButtonAvatarImage: 'rounded-full',
                      userButtonUsername: 'hidden',
                    },
                  }}
                />
              </Authenticated>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="ml-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>

            <Authenticated>
              <Button asChild variant="outline" size="sm">
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-8 w-8',
                    userButtonAvatarImage: 'rounded-full',
                    userButtonUsername: 'hidden',
                  },
                }}
              />
            </Authenticated>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={cn(
          'fixed inset-0 z-50 bg-background md:hidden h-screen',
          isOpen ? 'block' : 'hidden'
        )}
        initial={{ opacity: 0, x: '100%' }}
        animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full max-h-screen">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-background z-10">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="https://res.cloudinary.com/dfvtnrisi/image/upload/v1689936685/logo_jjwhbb.png"
                alt="meghdoot logo"
                width={50}
                height={50}
                className="cursor-pointer"
              />
              <div>
                <span className="text-xl font-semibold font-sans">
                  Meghdoot
                </span>
                <span className="text-xl font-semibold text-primary font-sans">
                  Pistons
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto pb-20 h-[calc(100vh-4rem)]">
            <nav className="flex flex-col items-start space-y-6 p-4">
              {navItems.map((item) => {
                if (item.submenu) {
                  return (
                    <div key={item.path} className="w-full">
                      <span className="text-lg font-medium mb-2 block">
                        {item.name}
                      </span>
                      <div className="flex flex-col items-start space-y-4 mb-4 pl-4">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'text-base transition-colors hover:text-primary',
                              pathname === subItem.path
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary w-full',
                      pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="w-full pt-4 border-t mt-4">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Sign In
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mb-2 flex items-center justify-center gap-2"
                  >
                    <Link href={'/dashboard'}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                      Dashboard
                    </Link>
                  </Button>
                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Sign Out
                    </Button>
                  </SignOutButton>
                </Authenticated>
              </div>
            </nav>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

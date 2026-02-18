'use client';
import MaxWidth from './MaxWidth';
import { navigationLinks } from '@/data/navbar.data';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, username, signIn, signOut } = useAuth();

  return (
    <nav className="w-full sticky top-0 inset-x-0 border-b border-border bg-white/50 z-999 backdrop-blur-2xl">
      <MaxWidth className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link href={'/'}>
            <h1 className="text-2xl font-semibold">ArqiTech</h1>
          </Link>
          <ul className="hidden items-center space-x-8 md:flex">
            {navigationLinks.map((items, index) => (
              <li
                key={index}
                className="text-lg text-neutral-700 hover:text-black cursor-pointer transition-colors"
              >
                <Link href={items.link} prefetch>
                  {items.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {isSignedIn ? (
            <>
              <Button className="text-base cursor-pointer" variant={'outline'}>
                {username}
              </Button>
              <Button className="text-base cursor-pointer" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="text-base cursor-pointer"
                variant={'outline'}
                onClick={signIn}
              >
                Sign In
              </Button>
              <Button className="text-base cursor-pointer">Get Started</Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </MaxWidth>

      <div
        className={`md:hidden border-t border-border bg-background ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <MaxWidth className="py-4">
          <ul className="flex flex-col gap-4">
            {navigationLinks.map((items, index) => (
              <li key={index}>
                <Link
                  href={items.link}
                  prefetch
                  className="block text-lg text-neutral-700 hover:text-black transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {items.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            {isSignedIn ? (
              <>
                <Button
                  className="text-base cursor-pointer"
                  variant={'outline'}
                >
                  {username}
                </Button>
                <Button className="text-base cursor-pointer" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="text-base cursor-pointer"
                  variant={'outline'}
                  onClick={signIn}
                >
                  Sign In
                </Button>
                <Button className="text-base cursor-pointer">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </MaxWidth>
      </div>
    </nav>
  );
};

export default Navbar;

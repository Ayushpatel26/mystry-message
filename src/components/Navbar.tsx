"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {User} from 'next-auth';
import { Button } from './ui/button';

const Navbar = () => {
    const {data: session} = useSession();

    const user: User = session?.user as User;

  return (
    <nav className='shadow-md bg-gray-100 px-4 py-2'>
      <div className='mx flex justify-between items-center'>
        <Link href={'/'} className='text-lg font-bold xs:text-2xl md:text-3xl lg:text-4xl xl:text-6xl'>
            Mystry Message
        </Link>
        {
            session ? (
                <>
                <span className='hidden font-semibold text-green-400 sm:block'>Welcome, {user?.username || user?.email}</span>
                <Button onClick={() => signOut()} className='w'>
                    Logout
                </Button>
                </>
            ) : (
                <Link href={'/sign-in'}>
                    <Button className=''>Login</Button>
                </Link>
            )
        }
      </div>
    </nav>
  )
}

export default Navbar

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

const MenuBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
        if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
        document.removeEventListener('click', handleOutsideClick);
    };
}, [isOpen]);



  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event) => {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
            setIsSignedIn(false);
            return
        }
        setIsSignedIn(data.session != null);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); 


  async function signUserOut() {
    try {
      await supabaseClient.auth.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative bg-white">
      <div className="bg-slate-700 text-slate-300 max-w-full mx-auto px-4 sm:px-6">
        
      <div className="flex justify-between items-center border-b-3 border-gray-100 pt-6 pb-4 md:space-x-10 w-full">
          
          <div className="flex justify-start items-center lg:w-0 lg:flex-1">
            <Link href='/' className="flex title-font font-medium items-center">
              <div className="pb-2 flex justify-center items-center">
                <Image
                  src='/logo.png'
                  alt="logo"
                  width={48}
                  height={48}
                />
              </div>
              <span className="ml-2 text-2xl hover:text-slate-100 font-bold">Fried Liver</span>
            </Link>
          </div>

          <div className="-my-2 md:hidden">
            <button type="button" onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-orange-100 bg-orange-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {isSignedIn ? 
              <Link href='/learn' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Learn</Link>
              :
              <Link href='/demo' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Try It</Link>
            }
            <Link href='/openings' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Openings</Link>
            <Link href='/about' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">About</Link>
            {isSignedIn ? 
                <>
                  <Link href='/account' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Account</Link>
                  <Link href='/' onClick={() => {signUserOut(); setIsOpen(!isOpen)}} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Sign Out</Link> 
                </> :
                <>
                  <Link href='/signin' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Sign In</Link>
                  <Link href='/signup' onClick={() => setIsOpen(!isOpen)} className="w-24 text-center sm:py-1 rounded-md bg-orange-200 text-slate-700 hover:bg-orange-100">Sign Up</Link>
                </>
            }
          </nav>

        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div ref={menuRef} className="absolute top-0 inset-x-0 transition transform origin-top-right md:hidden z-50">
          <div className="shadow-lg ring-1 ring-black ring-opacity-5 bg-slate-800 divide-y-2 divide-slate-50">
            <div className="pt-8 pb-6 px-6">
              <div className="flex items-center justify-between">
                <div>
                </div>

                <div className="-mr-2">
                  <button type="button" onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500">
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

              </div>
              <div className="mt-4">
                <nav className="grid gap-y-2">
                  {isSignedIn ? 
                    <Link href='/learn' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Learn</Link>
                    :
                    <Link href='/demo' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Try It</Link>
                  }
                  <Link href='/openings' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Openings</Link>
                  <Link href='/about' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">About</Link>
                  {isSignedIn ? 
                    <>
                      <Link href='/account' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Account</Link>
                      <Link href='/' onClick={() => {signUserOut();}} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Sign Out</Link> 
                    </> :
                    <>
                      <Link href='/signin' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Sign In</Link>
                      <Link href='/signup' onClick={() => setIsOpen(!isOpen)} className="text-slate-700 bg-orange-200 hover:bg-orange-100 rounded-lg p-2">Sign Up</Link>
                    </>
                  }
                  </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default MenuBar;

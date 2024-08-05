"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar.jsx";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconRobotFace,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export function SidebarDemo({children}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-up");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-up");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Tools",
      href: '/recipe-suggestions',
      icon: (
        <IconRobotFace className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#", // Add a fallback href
      onClick: handleSignOut,
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-100% mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <Link key={idx} 
              href={link.href || "#"} 
              passHref 
              onClick={link.onClick ? (e) => {
                e.preventDefault();
                link.onClick();
              } : undefined}
            >
              <SidebarLink link={link} />
              </Link>
            ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.displayName || user.email,
                href: "#",
                icon: (
                  <Image
                    src="/userPfp.jpeg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}

// ... (Logo and LogoIcon components remain unchanged)

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 overflow-hidden"
    >
      <img 
        src="https://t3.ftcdn.net/jpg/05/42/85/04/360_F_542850412_mbdrJttsmcColprJNmMeWgUoNsJLdFJn.jpg"
        alt="InventTrack Logo"
        width={32}
        height={32}
        className="object-cover rounded-lg flex-shrink-0"
        //className="h-8 w-8 object-cover rounded-lg flex-shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-nowrap"
      >
        InventTrack
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};



"use client";
import { mainNavItems } from "@/constants";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./SearchForm";

const Navigation = () => {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-full items-center justify-around bg-white py-4"
    >
      {/* Logo */}
      <div className="flex">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative size-8">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="m-0 text-3xl font-bold text-rose-400">Blossomy</h1>
        </Link>
      </div>

      {/* Right section containing Nav + Search */}
      <div className="flex items-center gap-8 max-sm:hidden">
        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className="m-0 flex list-none justify-start gap-8">
            {mainNavItems.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="hover:text-secondary text-lg font-semibold uppercase transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search input */}
        <div className="flex items-center">
          <SearchForm />
        </div>
      </div>
    </motion.header>
  );
};

export default Navigation;

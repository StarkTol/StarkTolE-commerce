import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { FiShoppingCart, FiHome, FiPackage, FiList } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { isSeller, cartItems } = useAppContext(); // 👈 get cart items
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  const userMenu = (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Action label="Home" labelIcon={<FiHome />} onClick={() => router.push("/")} />
        <UserButton.Action label="Product" labelIcon={<FiPackage />} onClick={() => router.push("/all-products")} />
        <UserButton.Action label="My Orders" labelIcon={<FiList />} onClick={() => router.push("/my-orders")} />
        <UserButton.Action label="Cart" labelIcon={<FiShoppingCart />} onClick={() => router.push("/cart")} />
        {isSeller && (
          <UserButton.Action label="Seller Dashboard" onClick={() => router.push("/seller")} />
        )}
      </UserButton.MenuItems>
    </UserButton>
  );

  const signInButton = (
    <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
      <Image src={assets.user_icon} alt="user icon" />
      Account
    </button>
  );

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
        {isSeller && (
          <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />

        {/* 🛒 Cart icon with item count */}
        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <FiShoppingCart className="text-xl" />
          {cartItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </div>

        {isLoaded && user ? userMenu : signInButton}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}
        {isLoaded && user ? userMenu : signInButton}
      </div>
    </nav>
  );
};

export default Navbar;

"use client"
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link"
import { Button } from "./ui/button";
import { ThemeToggler } from "@/components/theme/ThemeToggler";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV_ITEMS = [
    { name: "Home", Link: "/home" },
    { name: "Chat", Link: "/" },
    { name: "Features", Link: "/" }
];


export function AppBar() {
    const [isOpen, setIsOpen] = useState(false);
    const session = useSession();
    const router = useRouter();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="font-bold text-xl text-primary"
                    >
                        ChatApp
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {NAV_ITEMS.map((item, index) => (
                        <Link key={index} href={item.Link} className="text-sm font-medium hover:text-primary transition-colors">
                            {item.name}
                        </Link>
                    ))}
                    <ThemeToggler />
                </div>

                <div>
                    <Button variant={"secondary"} onClick={() => {
                        if (session && session?.data?.user) {
                            toast.loading("Logging Out...");
                            signOut({
                                callbackUrl: "/"
                            });
                        } else {
                            router.push("/signin");
                        }
                    }}>
                        {session && session?.data?.user ? "LogOut" : "Sign in"}
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {
                isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden border-b bg-background"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {NAV_ITEMS.map((item, index) => (
                                <Link key={index}
                                    href={item.Link}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex items-center gap-2 mr-7">
                                <ThemeToggler />
                                <Button asChild className="w-[80%]" variant={"secondary"} onClick={() => setIsOpen(false)}>
                                    <Link href="/chat">Start Chatting</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )
            }
        </motion.header>

    )
}
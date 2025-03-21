"use client"
import { motion } from "framer-motion";
import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Zap, Users, Star, Globe, Check } from "lucide-react";
import Link from "next/link";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

const LandingPage = () => {

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                >
                    <div className="py-20 md:py-28">
                        <div className="text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold tracking-tight text-primary"
                            >
                                Connect Instantly,{" "}
                                <span className="text-primary/80">Chat Seamlessly</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
                            >
                                Experience real-time conversations with a modern, secure, and
                                intuitive chat platform designed for seamless communication.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-10 flex items-center justify-center gap-4"
                            >
                                <Link href="/signin">
                                    <Button size="lg" className="gap-2">
                                        Start Chatting <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg">
                                    Learn More
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="py-20 bg-muted/50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover the features that make our chat platform stand out from the rest
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="h-6 w-6 text-primary" />,
                                title: "Real-time Chat",
                                description: "Experience instant messaging with real-time message delivery and typing indicators."
                            },
                            {
                                icon: <Shield className="h-6 w-6 text-primary" />,
                                title: "Secure & Private",
                                description: "Your conversations are protected with end-to-end encryption and strict privacy measures."
                            },
                            {
                                icon: <MessageCircle className="h-6 w-6 text-primary" />,
                                title: "Rich Features",
                                description: "Enjoy file sharing, emoji reactions, and group chat capabilities."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Statistics Section */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="py-20 bg-background"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: <Users />, stat: "10M+", label: "Active Users" },
                            { icon: <MessageCircle />, stat: "1B+", label: "Messages Sent" },
                            { icon: <Globe />, stat: "150+", label: "Countries" },
                            { icon: <Star />, stat: "4.9/5", label: "User Rating" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="p-6"
                            >
                                <div className="flex justify-center mb-4 text-primary">
                                    {item.icon}
                                </div>
                                <div className="text-3xl font-bold mb-2">{item.stat}</div>
                                <div className="text-muted-foreground">{item.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-20 bg-primary text-primary-foreground"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Chatting?</h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Join millions of users who trust our platform for their communication needs.
                        Start chatting instantly with no complicated setup required.
                    </p>
                    <Link href="/chat">
                        <Button size="lg" variant="secondary" className="gap-2">
                            Get Started Now <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Features List Section */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="py-20 bg-muted/30"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our platform comes packed with all the features you need for effective communication
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            "End-to-end encryption",
                            "Group chat support",
                            "File sharing",
                            "Emoji reactions",
                            "Message search",
                            "Custom notifications",
                            "Cross-platform sync",
                            "24/7 support"
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
                            >
                                <Check className="text-primary h-5 w-5" />
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );

}

export default LandingPage
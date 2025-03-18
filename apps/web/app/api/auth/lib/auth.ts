import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import prisma from "@repo/db/client";
import { importJWK, SignJWT, JWTPayload } from "jose";
import { randomUUID } from "crypto";
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface session extends Session {
    user: {
        id: string,
        name?: string,
        email: string,
        jwtToken: string,
    }
}

export interface token extends JWT {
    uid: string,
    JwtToken: string,
}

export interface user {
    id: string,
    name?: string,
    emial: string,
    token: string,
}

const generateJWT = async (payload: JWTPayload) => {
    const secret = process.env.JWT_SECRET;
    const jwk = await importJWK({ alg: "HS256", k: secret, kty: "oct" });

    const jwt = await new SignJWT({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: randomUUID(),
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(jwk);

    return jwt;
};


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { type: "email", label: "Email", placeholder: "Email" },
                password: { type: "password", label: "Password", placeholder: "Password" }
            },

            async authorize(credentials?: Record<"email" | "password", string>) {
                try {
                    if (!credentials) {
                        return null;
                    }
                    const { email, password } = credentials;
                    if (!email || !password) {
                        return null;
                    }
                    const hashedPassword = await bcrypt.hash(password, 10);

                    const userDb = await prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                        select: {
                            name: true,
                            id: true,
                            password: true,
                        }
                    });
                    if (userDb && userDb.password && await bcrypt.compare(password, userDb.password)) {
                        const jwt = await generateJWT({
                            id: userDb.id,
                        });
                        await prisma.user.update({
                            where: {
                                id: userDb.id
                            },
                            data: {
                                token: jwt,
                            }
                        });
                        return {
                            id: userDb.id,
                            name: userDb.name,
                            email: email,
                            token: jwt,
                        }

                    };
                    console.log("not in db");
                    return null;
                } catch (e) {
                    console.log(e)
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            const newSession: session = session as session;
            if (newSession.user && token.uid) {
                newSession.user.id = token.uid as string;
                newSession.user.jwtToken = token.JwtToken as string;
            }
            return newSession;
        },
        jwt: async ({ token, user }: { token: JWT, user: User }): Promise<JWT> => {
            const newToken: token = token as token;
            if (user) {
                newToken.uid = user.id;
                newToken.JwtToken = (user as user).token;
            }
            return newToken;
        },
    },

    secret: process.env.NEXTAUTH_SECRET || "secr3t"
} satisfies NextAuthOptions;
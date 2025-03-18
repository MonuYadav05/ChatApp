"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
// import { setCookie } from "cookies-next"
interface formData {
    email: string,
    password: string
}

export const Signin = () => {
    const [formData, setFormData] = useState<formData>({
        email: "",
        password: "",
    });
    const router = useRouter();

    const handleOnChange = ({ name, value }: { name: string, value: string }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        console.log(formData.email, formData.password)
        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });
            if (!res?.error) {
                router.push('/');
                console.log("Signin Success")
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    return <div>
        <form className="flex flex-col justify-center items-center w-[100vw] h-[100vh]" method="POST" onSubmit={(e) => handleSubmit(e)}>
            <input className="border p-2 px-4 rounded-xl m-2" required type="email" name="email" placeholder="Enter Email" value={formData?.email} onChange={(e) => handleOnChange({ name: e.target.name, value: e.target.value })} />
            <input className="border p-2 px-4 rounded-xl m-2" required type="password" name="password" placeholder="Enter Password" value={formData?.password} onChange={(e) => handleOnChange({ name: e.target.name, value: e.target.value })} />
            <button className="border p-2 px-4 rounded-xl m-2 cursor-pointer" type="submit">Signin</button>
        </form>
    </div>
} 
"use client"
import { useState } from "react";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";

interface formData {
    name: string,
    email: string,
    password: string
}

export default function Signup() {
    const [formData, setFormData] = useState<formData>({
        name: "",
        email: "",
        password: "",
    });

    const handleOnChange = ({ name, value }: { name: string, value: string }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(formData)
            const res = await axios.post(`${BACKEND_URL}/api/signup`, formData);
            console.log(res.data);
            if (res.data.success) { console.log("signup success") }
        }
        catch (err: any) {
            console.log(err.response.data.message)
        }
    }
    return <div>
        <form className="flex flex-col justify-center items-center w-[100vw] h-[100vh]" method="POST" onSubmit={(e) => handleSubmit(e)}>
            <input className="border p-2 px-4 rounded-xl m-2" required type="email" name="email" placeholder="Enter Email" value={formData?.email} onChange={(e) => handleOnChange({ name: e.target.name, value: e.target.value })} />
            <input className="border p-2 px-4 rounded-xl m-2" required type="password" name="password" placeholder="Enter Password" value={formData?.password} onChange={(e) => handleOnChange({ name: e.target.name, value: e.target.value })} />
            <input className="border p-2 px-4 rounded-xl m-2" required type="text" name="name" placeholder="Enter Name" value={formData?.name} onChange={(e) => handleOnChange({ name: e.target.name, value: e.target.value })} />
            <button className="border p-2 px-4 rounded-xl m-2 cursor-pointer" type="submit">SignUp</button>
        </form>
    </div>
} 
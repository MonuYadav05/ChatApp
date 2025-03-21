"use client"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";

const formSchema = z.object({
    name: z.string().min(2, { message: "name must be at least 2 characters" }),
    email: z.string().email({ message: "invalid email" }),
    password: z.string().min(5, { message: "password must be at least 6 characters" }),
});

export function SignupForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            console.log(data);
            const res = await axios.post(`${BACKEND_URL}/api/signup`, data);
            console.log(res.data);
            if (res.data.success) { console.log("signup success") }
        }
        catch (err: any) {
            console.log(err.response.data.message)
        }
    }

    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="py-1">Name</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-200 " placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="py-1">Email</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-200 " placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="pb-1">Password</FormLabel>
                            <FormControl>
                                <Input className="bg-background" placeholder="********" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full mt-1" type="submit">Submit</Button>
            </form>
        </Form>
    </div>
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/app/config";

export function CreateRoomButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        // @ts-ignore 
        const token = session?.user?.jwtToken;
        try {
            const response = await fetch(`${BACKEND_URL}/api/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) throw new Error("Failed to create room");

            const room = await response.json();
            // console.log(room)
            toast.success("Room created successfully");
            setOpen(false);
            router.refresh();
            router.push(`/room/${name}`);
        } catch (error) {
            toast.error(
                "Room Already Exists",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Room</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Chat Room</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter room name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter room description"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Room"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
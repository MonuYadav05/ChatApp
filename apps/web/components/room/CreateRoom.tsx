"use client";

import { BACKEND_URL } from "@/app/config";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Divide, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function CreateRoom() {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({
        name: "",
        description: "",
        password: "",
        type: "public" as "public" | "private",
    });


    const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const name = newRoom.name as string;
        const description = newRoom.description as string;
        const type = newRoom.type as "public" | "private";
        const password = newRoom.password as string;
        // @ts-ignore 
        const token = session?.user?.jwtToken;
        try {
            const response = await fetch(`${BACKEND_URL}/api/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `${token}`,
                },
                body: JSON.stringify({ name, description, type, password }),
            });

            if (!response.ok) throw new Error("Failed to create room");

            const room = await response.json();
            // console.log(room)
            toast.success("Room created successfully");
            setIsOpen(false);
            window.location.reload();

        } catch (error) {
            toast.error(
                "Room not Created",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Chat Rooms</h1>
                    <p className="text-muted-foreground mt-2">Join existing rooms or create your own</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={() => setIsOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Create Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleCreateRoom}>
                            <DialogHeader>
                                <DialogTitle>Create a New Room</DialogTitle>
                                <DialogDescription>
                                    Create a new chat room for your community
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Room Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter room name"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="Enter room description"
                                        value={newRoom.description}
                                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        placeholder="Enter room password"
                                        value={newRoom.password}
                                        onChange={(e) => setNewRoom({ ...newRoom, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Room Type</Label>
                                    <Select
                                        value={newRoom.type}
                                        onValueChange={(value: "public" | "private") =>
                                            setNewRoom({ ...newRoom, type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select room type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading === true ? <span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating..</span> : "Create Room"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>


        </div>
    );
}

export const CheckPass = async (roomId: number) => {


    return (<Dialog >
        <DialogTrigger asChild>
            <Button className="gap-2" >
                join Room
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm password</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="password">Room Password</Label>
                <Input
                    id="password"
                    name="password"
                    placeholder="Enter room password"
                    required
                />
            </div>  </DialogContent>
    </Dialog>
    )
}
import CreateRoom from "@/components/room/CreateRoom";
import RoomListing from "@/components/room/RoomListing";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const getRooms = async () => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return rooms;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export default async function Home() {
    const session = await getServerSession();
    if (!session) {
        redirect("/signin");
    }
    const rooms = await getRooms();
    if (rooms.length === 0) {
        toast.error("No Rooms Found");
        return <div>No Rooms Found</div>
    }
    return (
        <>
            <CreateRoom />
            <RoomListing Rooms={rooms} />
        </>
    );
}

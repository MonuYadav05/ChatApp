import CreateRoom from "@/components/room/CreateRoom";
import RoomListing from "@/components/room/RoomListing";
import prisma from "@repo/db/client";
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

    const rooms = await getRooms();
    console.log(rooms)
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

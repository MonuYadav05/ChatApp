import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../../components/ChatRoom";

// Define the expected type for Next.js dynamic route params
interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getRoomId(slug: string) {
    const res = await axios.post(`${BACKEND_URL}/room/${slug}`);
    if (res.data.success === false) return null;
    return res.data.roomId;
}

export default async function ChatRoom1({ params }: PageProps) {
    // @ts-ignore
    const reslovedParams = await params;
    const slug = reslovedParams?.slug;
    const roomId = await getRoomId(slug);

    if (roomId === null) {
        return <div>Room not found. Please check the URL and try again.</div>;
    }

    return <ChatRoom roomId={roomId} />;
}

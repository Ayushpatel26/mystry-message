import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, {status: 400})
        
    }
    try {
        await dbConnect;
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Error in delete message route", error);
        return Response.json({
            success: false,
            message: "Error deleting message! Please try again later."
        }, {status: 500})
    }
}
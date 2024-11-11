import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user";

export async function POST(request: Request) {
    const {username, content} = await request.json();

    try {
        await dbConnect;
        const user = await UserModel.findOne({username});
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found',
            }, {status: 404})
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User is not accepting messages'
                },
                { status: 403}
            )
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: 'Message sent Successfully'
            },
            { status: 200}
        )
    } catch (error) {
        console.log("An unexpected error occured: ", error);
        return Response.json(
            {
                success: false,
                message: 'Error while sending the message'
            },
            { status: 500}
        )
    }
}
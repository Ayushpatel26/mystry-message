import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import UserModel from '@/models/user';

export async function GET() {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        await dbConnect;
        
        const user = await UserModel.aggregate([
            { $match: { _id: userId }},
            // { $unwind: '$messages'},
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true }},
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404}
            )
        }
        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            { status: 200}
        )
    } catch (error) {
        console.log("An unexpected error occured: ", error);
        return Response.json(
            {
                success: false,
                message: "Error occurs"
            },
            { status: 500 }
        )
    }
}
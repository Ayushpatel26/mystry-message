import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function POST(request: Request) {
    await dbConnect;

    try {
        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username);// for safety
        const user = await UserModel.findOne({username: decodedUsername});

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
        { status: 400 })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            // Now, we should delete the verifyCode and verifyCodeExpiry
            // optionally we can add the time and date when user verified itself

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully"
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            // I think I have to delete this entry from database
            // so that user can signup with the same credentials
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, please signup again to get a new code"
                },
                { status: 400}
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification code"
                },
                { status: 400}
            )
        }
    } catch (error) {
        console.log("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            { status: 500 }
        )
    }
}
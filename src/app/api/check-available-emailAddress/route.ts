import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { emailValidation } from "@/schemas/signUpSchema";

const EmailQuerySchema = z.object({
    email: emailValidation,
});

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();
        
        // Validate the email
        const parsedEmail = EmailQuerySchema.safeParse({ email });
        if (!parsedEmail.success) {
            return Response.json(
                {
                    success: false,
                    message: parsedEmail.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail && existingUserByEmail.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists with this email",
                },
                { status: 400 }
            );
        }
        if (existingUserByEmail && !existingUserByEmail.isVerified) {
            return Response.json(
                {
                    success: true,
                    message: "Your Email is not Verified",
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Email is available for registration",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing email check:", error);
        return Response.json(
            {
                success: false,
                message: "An error occurred while processing the request.",
            },
            { status: 500 }
        );
    }
}

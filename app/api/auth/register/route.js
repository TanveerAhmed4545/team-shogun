import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill in all fields." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      status: "pending", // Status becomes pending, waiting for admin approval
    });

    // Create notification for admins
    try {
      const Notification = (await import("@/models/Notification")).default;
      const admins = await User.find({ role: "admin" });
      
      const notificationPromises = admins.map(admin => 
        Notification.create({
          userId: admin._id,
          title: "New User Registration",
          message: `${name} (${email}) has registered and is awaiting approval.`,
          type: "team",
          link: "/team"
        })
      );
      await Promise.all(notificationPromises);
    } catch (notificationError) {
      console.error("Failed to create admin notification:", notificationError);
      // Don't fail the registration if notification fails
    }

    return NextResponse.json(
      { message: "Registration successful. Please wait for admin approval.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}

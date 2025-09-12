import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// create  a store

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    //get data from form

    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "missing store info" },
        { status: 400 }
      );
    }
    // check user previous registration
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });
    // status of store
    if (store) {
      return NextResponse.json({ status: store.status });
    }
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "username already taken" },
        { status: 400 }
      );
    }

    //image upload
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto",
        },
        {
          format: "webp",
        },
        {
          width: "512",
        },
      ],
    });

    const newStore = await prisma.store.create({
      data: userId,
      name,
      description,
      username: username.toLowerCase(),
      email,
      contact,
      address,
      logo: optimizedImage,
    });

    // link to user

    await prisma.user.update({
      where: { id: userId },
      data: {
        store: {
          connect: { id: newStore.id },
        },
      },
    });

    return NextResponse.json({ message: "applied, waiting for approval" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}



//check is user have already registered a store and send a status of stre


export async function GET(request){
try{
        const { userId } = getAuth(request);
  // check user previous registration
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });
    // status of store
    if (store) {
      return NextResponse.json({ status: store.status });
    }
   

    return NextResponse.json({status: "not registered" })
    

}
 catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

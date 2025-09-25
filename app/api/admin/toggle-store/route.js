import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin"
import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authAdmin } from "../../../../middlewares/authAdmin";

// Toggle stoe =active....

export async function POST(req){
    try{
        const {userId} = getAuth(request)

        const isAdmin = await authAdmin(userId)

        if(!isAdmin){
            return NextResponse.json({error: 'not authorized'}, {status: 401})
        }

        
        const {storeId}= await request.json()

        if(!storeId){
            return NextResponse.json({error: "missing storeid"}, {status: 400})
        }


        //find store
        const store = await prisma.store.findUnique({where: {id: storeId}})

        if(!store){
                        return NextResponse.json({error: "missing store"}, {status: 400})

        }

        await prisma.store.update({
            where: {id: storeId}, 
            data: {isActive: !store.isActive}
        })
return NextResponse.json({message: "Store updated successfully"})


    }
    catch(error){
        console.error(error);
 return NextResponse.json({error:error.code || error.message}, {status: 400})

    }
}
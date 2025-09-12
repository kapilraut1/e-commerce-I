import authSeller from "@/middlewares/authSeller"
import {getAuth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


//Auth Seller
export async function GET(request){
    try {
        const {userId} = getAuth(request)

        const isSeller = await authSeller(userId)


        if(!isSeller){
            return NextResponse.json({
                error: "not au"
            }, {
                status: 401
            })
        }
        const storeinfo = await prisma.store.findUnique({
            where: {userId}
        }) 
   return NextResponse.json({
                error: error.code || error.message
            }, {
                status: 400
            })
        }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            error: error.code || error.message}, {
            status: 400
        })
    }
}

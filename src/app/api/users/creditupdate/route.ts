import { creditUpdate } from "@/helper/creditUpdate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const {email} = await request.json()
        const result = await creditUpdate(email)
        
        return NextResponse.json({result})

    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 400}
        )
    }
}
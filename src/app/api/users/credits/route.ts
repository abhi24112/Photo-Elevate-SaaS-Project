import { creditFeching } from "@/helper/creditFetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const {email} = await request.json()
        const credits = await creditFeching(email)
        return NextResponse.json({credits})

    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 400}
        )
    }
}
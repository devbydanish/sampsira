import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { amount } = await request.json();

    const jwt = request.headers.get("Authorization");

    if (!jwt) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/withdraw`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: jwt,
            },
            body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || "Failed to withdraw" },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing withdrawal:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}

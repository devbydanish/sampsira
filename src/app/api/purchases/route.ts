import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log(request)
    const jwt = request.headers.get("authorization")?.split(" ")[1];
    console.log(jwt)
    if (!jwt) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });

    console.log(userResponse)

    if (!userResponse.ok) {
        return NextResponse.json({ error: "User Error" }, { status: 401 });
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    const purchasesResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions?populate[track][populate]=*&populate[users_permissions_user][populate]=*`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    });



    const purchasesData = await purchasesResponse.json();
    console.log("purchasesData", purchasesData);
    if (!purchasesResponse.ok) {
        return NextResponse.json({ error: "History Error" }, { status: 400 });
    }

    console.log("purchasesData", purchasesData.data[0].attributes.users_permissions_user);
    const userPurchases = purchasesData.data.filter((purchase: any) => purchase.attributes.users_permissions_user.data.id === userId);
    console.log(userPurchases)
    return NextResponse.json({
        ok: true,
        data: userPurchases,
        message: "Purchases fetched successfully",
    });
}

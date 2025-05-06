import axios from "axios";

export const POST = async (req: Request) => {
    try {
        const request = await req.json();
        const token = req.headers.get("Authorization");
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks`,
            { data: request },
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        const response = res.data;

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
};
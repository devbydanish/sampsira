import axios from "axios";

export const GET = async (req: Request) => {
    try {

        const result = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sound-kits?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_MUSIC_TOKEN}`,
                },
            }
        );
        const response = result.data;

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {
        const request = await req.json();
        const token = req.headers.get("Authorization");

        // Check if any song exist in strapi
        // const result = await axios.get(
        //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks?populate=*`,
        //     {
        //         headers: {
        //             Authorization: token,
        //         },
        //     }
        // );
        // if (result.data.data.length > 0) {
        //     console.log("Deleting previous song and its files");
        //     const coverFileId = result.data.data[0].attributes.cover.data.id;
        //     for (let i = 0; i < result.data.data.length; i++) {
        //         const songId = result.data.data[i].id;
        //         const audioFileId = result.data.data[i].attributes.audio.data.id;
        //         await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/${songId}`, {
        //             headers: {
        //                 Authorization: token,
        //             },
        //         });
        //         await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/files/${audioFileId}`, {
        //             headers: {
        //                 Authorization: token,
        //             },
        //         });
        //     }
        //     await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/files/${coverFileId}`, {
        //         headers: {
        //             Authorization: token,
        //         },
        //     });
        // }

        // // Check if any sound kit exist in strapi
        // const soundkitResult = await axios.get(
        //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sound-kits?populate=*`,
        //     {
        //         headers: {
        //             Authorization: token,
        //         },
        //     }
        // );

        // if (soundkitResult.data.data.length > 0) {
        //     console.log("Deleting previous sound kit and its files");
        //     for (let i = 0; i < soundkitResult.data.data.length; i++) {
        //         const soundkitId = soundkitResult.data.data[i].id;
        //         await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sound-kits/${soundkitId}`, {
        //             headers: {
        //                 Authorization: token,
        //             },
        //         });
        //     }
        // }

        // Create new sound kit
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sound-kits`,
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
        return new Response(JSON.stringify(error), { status: 500 });
    }
};
import axios from "axios";

export const GET = async (req: Request) => {
    try {
        const result = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks?populate=*`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_MUSIC_TOKEN}`,
                },
            }
        );
        if (result.data.data.length === 0) {
            return new Response (JSON.stringify({}), { status: 200 });
        }
        const res = result.data.data;
        const response = res.map((song: any) => {
            return {
                id: song.id,
                title: song.attributes.title,
                releaseDate: song.attributes.releaseDate,
                singer: song.attributes.singer,
                img_url: process.env.NEXT_PUBLIC_STRAPI_URL+song.attributes.cover?.data?.attributes?.url || "",
                audio_url: process.env.NEXT_PUBLIC_STRAPI_URL+song.attributes.audio?.data?.attributes?.url || "",
            };
        });            

        return new Response (JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response (JSON.stringify(error), { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
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
        //     for (let i = 0; i < result.data.data.length; i++) {
        //         const songId = result.data.data[i].id;
        //         const audioFileId = result.data.data[i].attributes.audio.data.id;
        //         const coverFileId = result.data.data[i].attributes.cover.data.id;
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
        //         await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload/files/${coverFileId}`, {
        //             headers: {
        //                 Authorization: token,
        //             },
        //         });
        //     }
        // }

        // // Check if any album exist in strapi
        // const albumResult = await axios.get(
        //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/albums?populate=*`,
        //     {
        //         headers: {
        //             Authorization: token,
        //         },
        //     }
        // );

        // if (albumResult.data.data.length > 0) {
        //     console.log("Deleting previous album and its files");
        //     for (let i = 0; i < albumResult.data.data.length; i++) {
        //         const albumId = albumResult.data.data[i].id;
        //         await axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/albums/${albumId}`, {
        //             headers: {
        //                 Authorization: token,
        //             },
        //         });
        //     }
        // }

        console.log("Creating new song and album");
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks`,
             {data},
            {
                headers: {
                    Authorization: token,
                },
            }
            );
        console.log(res);
        const response = res.data;

        return new Response (JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response (JSON.stringify(error), { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    try {
        const request = await req.json();
        const { id } = request;
        console.log(request);
        const token = req.headers.get("Authorization");
        const res = await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/${id}`, {data:request}, {
            headers: {
                Authorization: token,
            },
        }
        );
        const response = res.data;

        return new Response (JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response (JSON.stringify(error), { status: 500 });
    }
};

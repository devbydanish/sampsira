/**
 * @name Music
 * @file index.tsx
 * @description Music page layout
 */
"use client";

// Modules
import React, { useEffect, useState } from "react";

// Components
import Sidebar from "@/core/components/sidebar";

// Utilities
import { USER_KEY } from "@/core/constants/constant";
import { CurrentUserTypes } from "@/core/types";

interface Props {
    children: React.ReactNode;
}

const Music: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<CurrentUserTypes | null>(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(USER_KEY) as string);
        setUser(data);
    }, []);

    return (
        <>
            <Sidebar />

            {/* Page content [[ Find at scss/framework/wrapper.scss ]] */}
            <main id="page_content">{children}</main>

            {/* Backdrop [[ Find at scss/framework/wrapper.scss ]] */}
            <div id="backdrop"></div>
        </>
    );
};

Music.displayName = "Music";
export default Music;

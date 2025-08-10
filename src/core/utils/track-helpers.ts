/**
 * Helper functions for track ownership and purchase status
 */

export interface TrackOwnershipStatus {
    isOwned: boolean;
    isPurchased: boolean;
    // Fine-grained purchase details
    hasAudioPurchased?: boolean;
    hasStemsPurchased?: boolean;
    canPurchase: boolean;
    buttonText: string;
    buttonDisabled: boolean;
}

/**
 * Check if user owns a track (is the producer)
 */
export const isTrackOwnedByUser = (track: any, user: any): boolean => {
    if (!track || !user) return false;

    // Check if user is the producer of the track
    if (track.producer?.data?.id === user.id) return true;
    if (track.producer?.id === user.id) return true;

    // Check if track is in user's tracks array (for owned tracks)
    if (user.tracks && Array.isArray(user.tracks)) {
        return user.tracks.some((userTrack: any) =>
            userTrack.id === track.id || userTrack.id === track.id?.toString()
        );
    }

    // Check Producers array
    if (track.Producers && Array.isArray(track.Producers)) {
        return track.Producers.some((producer: any) =>
            producer.id === user.id || producer.id === user.id?.toString()
        );
    }

    return false;
};

/**
 * Check if user has purchased a track
 */
export const isTrackPurchasedByUser = (track: any, user: any): boolean => {
    if (!track || !user) return false;

    // Check if track is in user's track_purchased array
    if (user.track_purchased && Array.isArray(user.track_purchased)) {
        return user.track_purchased.some((purchasedTrack: any) =>
            purchasedTrack.id === track.id || purchasedTrack.id === track.id?.toString()
        );
    }

    return false;
};

export interface TrackPurchaseStatus {
    hasAudio: boolean;
    hasStems: boolean;
}

/**
 * Derive per-track purchase status from credit transactions data
 * Accepts an array of credit-transaction items (as returned by our /api/purchases route)
 */
export const getTrackPurchaseStatusFromTransactions = (
    transactions: any[],
    trackId: string | number
): TrackPurchaseStatus => {
    let hasAudio = false;
    let hasStems = false;

    if (!Array.isArray(transactions)) {
        return { hasAudio, hasStems };
    }

    const normalizedTrackId = String(trackId);
    for (const tx of transactions) {
        const txTrackId = String(
            tx?.attributes?.track?.data?.id ?? tx?.track?.id ?? tx?.track?.data?.id ?? ""
        );
        if (txTrackId !== normalizedTrackId) continue;

        // Amounts stored negative for purchases by user, positive for sales for producer
        const amountAbs = Math.abs(Number(tx?.attributes?.amount ?? tx?.amount ?? 0));
        const details = (tx?.attributes?.details ?? tx?.details ?? "").toLowerCase();

        if (details.includes("audio+stems") || amountAbs === 7.5 || amountAbs === 5) {
            hasStems = true;
            hasAudio = true; // stems implies audio ownership overall
        } else if (details.includes("audio") || amountAbs === 2.5) {
            hasAudio = true;
        }
    }

    return { hasAudio, hasStems };
};

/**
 * Convenience helper to fetch current user's purchase transactions and derive status for a track.
 * Requires a valid JWT in localStorage or provided directly.
 */
export const fetchTrackPurchaseStatus = async (
    trackId: string | number,
    jwt?: string | null
): Promise<TrackPurchaseStatus> => {
    try {
        const token = jwt ?? (typeof window !== 'undefined' ? localStorage.getItem('jwt') : null);
        if (!token) return { hasAudio: false, hasStems: false };

        const res = await fetch('/api/purchases', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) return { hasAudio: false, hasStems: false };
        const data = await res.json();
        const transactions = Array.isArray(data?.data) ? data.data : [];
        return getTrackPurchaseStatusFromTransactions(transactions, trackId);
    } catch (e) {
        console.warn('Failed to fetch track purchase status', e);
        return { hasAudio: false, hasStems: false };
    }
};

/**
 * Get the complete ownership status for a track
 */
export const getTrackOwnershipStatus = (
    track: any,
    user: any,
    purchaseStatus?: TrackPurchaseStatus
): TrackOwnershipStatus => {
    // Logged out users: generic purchase
    if (!user) {
        return {
            isOwned: false,
            isPurchased: false,
            hasAudioPurchased: false,
            hasStemsPurchased: false,
            canPurchase: true,
            buttonText: "Purchase Sample",
            buttonDisabled: false,
        };
    }

    const isOwned = isTrackOwnedByUser(track, user);

    if (isOwned) {
        return {
            isOwned: true,
            isPurchased: false,
            hasAudioPurchased: false,
            hasStemsPurchased: false,
            canPurchase: false,
            buttonText: "Owned",
            buttonDisabled: true,
        };
    }

    // Default to legacy purchased check while purchaseStatus loads
    const legacyPurchased = isTrackPurchasedByUser(track, user);
    const hasAudio = purchaseStatus?.hasAudio ?? legacyPurchased;
    const hasStems = purchaseStatus?.hasStems ?? false;

    // Both purchased
    if (hasAudio && hasStems) {
        return {
            isOwned: false,
            isPurchased: true,
            hasAudioPurchased: true,
            hasStemsPurchased: true,
            canPurchase: false,
            buttonText: "Purchased",
            buttonDisabled: true,
        };
    }

    // Audio only purchased
    if (hasAudio && !hasStems) {
        return {
            isOwned: false,
            isPurchased: true,
            hasAudioPurchased: true,
            hasStemsPurchased: false,
            canPurchase: true,
            buttonText: "Buy Stems (5 credits)",
            buttonDisabled: false,
        };
    }

    // Not purchased
    return {
        isOwned: false,
        isPurchased: false,
        hasAudioPurchased: false,
        hasStemsPurchased: false,
        canPurchase: true,
        buttonText: "Purchase Sample",
        buttonDisabled: false,
    };
};

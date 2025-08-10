"use client";

import { RiHeartFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// Contexts
import { useTheme } from "@/core/contexts/theme";

// Components
import PlayButton from "../audio-player/play";
import TrackDropdown, { TrackDropdownProps } from "../dropdown";
import StemsPurchaseModal from "../modals/stems-purchase-modal";

// Utilities
import {
  fetchTrackPurchaseStatus,
  getTrackOwnershipStatus,
} from "@/core/utils/track-helpers";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface TrackProps extends Omit<TrackDropdownProps, "href"> {
  data: any;
  dropdown?: boolean;
  link?: boolean;
  myUploads?: boolean;
  newRelease?: boolean;
  onEditSample?: (track: any) => void;
  editModeId?: string | null;
}

const propTypes = {
  data: PropTypes.any.isRequired,
  dropdown: PropTypes.bool,
  link: PropTypes.bool,
  newRelease: PropTypes.bool,
};

export default function TrackCard({
  data,
  dropdown,
  like,
  queue,
  playlist,
  play,
  link,
  myUploads = false,
  newRelease = false,
  onEditSample,
  editModeId,
}: TrackProps) {
  const { replaceClassName } = useTheme();
  const [showStemsModal, setShowStemsModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{
    hasAudio: boolean;
    hasStems: boolean;
  }>({ hasAudio: false, hasStems: false });
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const trackData = {
    ...data,
    id: data.id,
    title: data.title || data.name,
    type: "track",
    src:
      data.src ||
      (data.audio?.data?.attributes?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.audio.data.attributes.url}`
        : data.audioUrl),
    cover:
      data.cover ||
      (data.cover?.data?.attributes?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.cover.data.attributes.url}`
        : "/images/cover/default.jpg"),
    Producers: data.Producers || [],
  };

  // Pull fine-grained purchase status from transactions and feed to helper
  // This enables showing stems-only CTA when audio is already purchased
  const ownershipStatus = getTrackOwnershipStatus(
    trackData,
    user,
    purchaseStatus
  );

  // Load purchase status when user or track changes
  useEffect(() => {
    (async () => {
      if (!user || !trackData?.id) {
        setPurchaseStatus({ hasAudio: false, hasStems: false });
        return;
      }
      const status = await fetchTrackPurchaseStatus(trackData.id);
      setPurchaseStatus(status);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, trackData?.id]);

  const trackUrl = `/producers/${encodeURIComponent(trackData.Producers?.[0]?.name?.toLowerCase() || "")}/${encodeURIComponent(trackData.title.toLowerCase())}`;

  const handlePurchase = async (amount: any) => {
    if (!trackData) return { success: false, message: "No track found" };
    // Check if user is logged in
    if (!user) {
      router.push("/auth/login");
      return { success: false, message: "User not logged in" };
    }
    // Use the credits use api
    const response = await fetch("/api/credits/use", {
      method: "POST",
      body: JSON.stringify({
        trackId: trackData.id,
        amount,
        jwt: localStorage.getItem("jwt"),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to purchase sample");
    }

    const responseData = await response.json();

    // Immediately refresh purchase status so UI updates without reload
    try {
      const status = await fetchTrackPurchaseStatus(trackData.id);
      setPurchaseStatus(status);
    } catch (err) {
      console.warn("Failed to refresh purchase status after purchase", err);
    }
    return responseData;
  };

  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't open modal if track is owned or already purchased
    if (ownershipStatus.buttonDisabled) {
      return;
    }

    setShowStemsModal(true);
  };

  return (
    <div className="cover cover--round scale-animation">
      {/* Cover head */}
      <div className="cover__head d-flex justify-content-end">
        {data.like && (
          <ul className="cover__label d-flex me-auto">
            <li>
              <span className="badge rounded-pill bg-danger">
                <RiHeartFill size={16} />
              </span>
            </li>
          </ul>
        )}
      </div>

      {/* Cover image */}
      <div className="cover__image position-relative">
        <Link
          href={`/producers/${encodeURIComponent(trackData.Producers?.[0]?.name?.toLowerCase() || "")}/${encodeURIComponent(trackData.title.toLowerCase())}`}
          className="d-block ratio ratio-1x1"
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            src={trackData.cover}
            width={320}
            height={320}
            alt={trackData.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
        </Link>
        <div className="position-absolute top-0 end-0 m-2 z-3">
          <TrackDropdown
            data={trackData}
            btnClassName="btn btn-icon btn-sm btn-dark rounded-circle opacity-0 hover-show"
            className="dropdown"
            iconVertical={false}
          />
        </div>
        <PlayButton track={trackData} />
        {!myUploads && newRelease && (
          <div className="purchase-overlay">
            <button
              className={`purchase-button ${ownershipStatus.buttonDisabled ? "disabled" : ""}`}
              onClick={handlePurchaseClick}
              disabled={ownershipStatus.buttonDisabled}
            >
              {ownershipStatus.buttonText}
            </button>
          </div>
        )}
      </div>

      {/* Cover foot */}
      <div className="cover__foot">
        <div className="d-flex align-items-center justify-content-between">
          <div className="cover__details">
            <Link
              href={trackUrl}
              className={`cover__title hover-underline ${replaceClassName(
                "text-dark"
              )}`}
            >
              {trackData.title}
            </Link>
            {trackData.Producers && trackData.Producers.length > 0 && (
              <p className="cover__subtitle text-muted">
                {trackData.Producers.map((producer: any, index: number) => (
                  <Link
                    key={index}
                    href={`/producers/${producer.name?.toLowerCase() || ""}`}
                    className="hover-underline"
                  >
                    {producer.name}
                    {trackData.Producers &&
                    trackData.Producers.length - 1 === index
                      ? ""
                      : ", "}
                  </Link>
                ))}
              </p>
            )}
          </div>
          {myUploads && onEditSample && (
            <button
              className="my-uploads-link-edit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditSample(trackData);
              }}
            >
              {editModeId === trackData.id ? "Cancel" : "Edit"}
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .my-uploads-link-edit {
          color: #ff6600 !important;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none !important;
          padding: 0;
          cursor: pointer;
          background: none !important;
          border: none !important;
          outline: none;
          display: block;
          text-align: left;
        }
        .hover-show {
          transition: opacity 0.2s;
        }
        .cover__image:hover .hover-show {
          opacity: 1 !important;
        }
        .cover__image {
          position: relative;
          overflow: hidden;
        }
        .purchase-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .cover__image:hover .purchase-overlay {
          transform: translateY(0);
        }
        .purchase-button {
          width: 100%;
          background: none;
          border: none;
          color: white;
          text-align: center;
          padding: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .purchase-button:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        .purchase-button.disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .purchase-button.disabled:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .cover__title {
          cursor: pointer;
        }
        .cover__title:hover {
          text-decoration: underline !important;
        }
        .hover-underline:hover {
          text-decoration: underline !important;
        }
      `}</style>

      <StemsPurchaseModal
        isOpen={showStemsModal}
        onClose={() => setShowStemsModal(false)}
        onPurchaseWithStems={() =>
          handlePurchase(
            purchaseStatus.hasAudio && !purchaseStatus.hasStems ? 5 : 7.5
          )
        }
        onPurchaseAudioOnly={
          purchaseStatus.hasAudio ? undefined : () => handlePurchase(2.5)
        }
        showOnlyStemsOption={
          purchaseStatus.hasAudio && !purchaseStatus.hasStems
        }
      />
    </div>
  );
}

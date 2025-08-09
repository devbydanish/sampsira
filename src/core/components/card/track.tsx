"use client";

import { RiHeartFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";

// Contexts
import { useTheme } from "@/core/contexts/theme";

// Components
import PlayButton from "../audio-player/play";
import TrackDropdown, { TrackDropdownProps } from "../dropdown";
import StemsPurchaseModal from "../modals/stems-purchase-modal";

// Utilities
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
    return responseData;
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
              className="purchase-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowStemsModal(true);
              }}
            >
              Purchase Sample
            </button>
          </div>
        )}
      </div>

      {/* Cover foot */}
      <div className="cover__foot">
        <div className="d-flex flex-column">
          <Link
            href={trackUrl}
            className={`cover__title text-truncate text-white text-decoration-none hover-underline`}
            style={{ color: "#fff" }}
          >
            {trackData.title}
          </Link>
          {myUploads ? (
            <>
              <div className="cover__subtitle text-truncate text-white small">
                {trackData.genre && (
                  <div>
                    Genre:{" "}
                    {Array.isArray(trackData.genre)
                      ? trackData.genre.map((g: any) => g.name).join(", ")
                      : trackData.genre}
                  </div>
                )}
                {trackData.bpm && <div>BPM: {trackData.bpm}</div>}
                {Array.isArray(trackData.keys) && trackData.keys.length > 0 && (
                  <div>Keys: {trackData.keys.join(", ")}</div>
                )}
                {!Array.isArray(trackData.keys) && trackData.keys && (
                  <div>Keys: {String(trackData.keys)}</div>
                )}
                {Array.isArray(trackData.moods) &&
                  trackData.moods.length > 0 && (
                    <div>Moods: {trackData.moods.join(", ")}</div>
                  )}
                {!Array.isArray(trackData.moods) && trackData.moods && (
                  <div>Moods: {String(trackData.moods)}</div>
                )}
              </div>
              <button
                className="my-uploads-link-edit mt-2"
                onClick={() => onEditSample && onEditSample(trackData)}
              >
                Edit
              </button>
            </>
          ) : (
            trackData.Producers &&
            trackData.Producers.length > 0 && (
              <div className="cover__subtitle text-truncate">
                {trackData.Producers.map((producer: any, index: number) => {
                  // Accept both InfoType and possible extended types with username
                  const slug = producer.name
                    ? encodeURIComponent(producer.name.toLowerCase())
                    : undefined;
                  return (
                    <Link
                      key={index}
                      href={slug ? `/producers/${slug}` : "#"}
                      className="text-secondary text-decoration-none hover-underline"
                    >
                      {producer.name}
                      {index < trackData.Producers.length - 1 ? ", " : ""}
                    </Link>
                  );
                })}
              </div>
            )
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
        onPurchaseWithStems={() => handlePurchase(7.5)}
        onPurchaseAudioOnly={() => handlePurchase(2.5)}
      />
    </div>
  );
}

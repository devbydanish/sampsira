"use client";

import { RiDownloadLine, RiMoreFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

// Contexts
import { useTheme } from "@/core/contexts/theme";

// Components
import PlayButton from "./audio-player/play";
import StemsPurchaseModal from "./modals/stems-purchase-modal";

// Utilities
import {
  fetchTrackPurchaseStatus,
  getTrackOwnershipStatus,
} from "@/core/utils/track-helpers";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface TrackListProps {
  data: any;
  duration?: boolean;
  link?: boolean;
  play?: boolean;
  number?: number;
  download?: boolean;
  dropdown?: boolean;
  like?: boolean;
  playlist?: boolean;
  queue?: boolean;
  grid?: boolean;
  columns?: number;
  infiniteScroll?: boolean;
}

const propTypes = {
  data: PropTypes.any.isRequired,
  duration: PropTypes.bool,
  link: PropTypes.bool,
  play: PropTypes.bool,
  number: PropTypes.number,
  download: PropTypes.bool,
  dropdown: PropTypes.bool,
  like: PropTypes.bool,
  playlist: PropTypes.bool,
  queue: PropTypes.bool,
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const TrackList: React.FC<TrackListProps> = ({
  data,
  duration,
  play,
  link,
  number,
  download,
  dropdown,
  like,
  playlist,
  queue,
}) => {
  const { replaceClassName } = useTheme();
  const [audioDuration, setAudioDuration] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showStemsModal, setShowStemsModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{
    hasAudio: boolean;
    hasStems: boolean;
  }>({ hasAudio: false, hasStems: false });
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  // Get track ownership status
  const ownershipStatus = getTrackOwnershipStatus(data, user, purchaseStatus);

  useEffect(() => {
    if (duration && data.src) {
      const audio = new Audio(data.src);
      audio.addEventListener("loadedmetadata", () => {
        const durationStr = formatDuration(audio.duration);
        setAudioDuration(durationStr);
      });
      audio.addEventListener("error", (e) => {
        console.error("Error loading audio:", e);
        setAudioDuration("0:00");
      });

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [duration, data.src]);

  // Load purchase status when user or track changes
  useEffect(() => {
    (async () => {
      if (!user || !data?.id) {
        setPurchaseStatus({ hasAudio: false, hasStems: false });
        return;
      }
      const status = await fetchTrackPurchaseStatus(data.id);
      setPurchaseStatus(status);
    })();
  }, [user?.id, data?.id]);

  const trackUrl = `/producers/${encodeURIComponent(data.Producers?.[0]?.name?.toLowerCase() || "")}/${encodeURIComponent(data.title?.toLowerCase() || "")}`;

  const handlePurchase = async (amount: any) => {
    if (!data) return { success: false, message: "No data available" };
    // Check if user is logged in
    if (!user) {
      router.push("/auth/login");
      return { success: false, message: "User not logged in" };
    }

    const response = await fetch("/api/credits/use", {
      method: "POST",
      body: JSON.stringify({
        trackId: data.id,
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
      const status = await fetchTrackPurchaseStatus(data.id);
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
    <div className="list__item">
      <div className="list__cover">
        <Link
          href={trackUrl}
          className="d-block ratio ratio-1x1"
          style={{ width: "100%", height: "100%" }}
        >
          <Image
            src={data.cover}
            width={80}
            height={80}
            alt={data.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
        </Link>
        {play && <PlayButton track={data} />}
      </div>

      <div className="list__content">
        <div className="list__title">
          <Link
            href={trackUrl}
            className={`hover-underline ${replaceClassName("text-dark")}`}
          >
            {data.title}
          </Link>
          {data.Producers && data.Producers.length > 0 && (
            <p className="text-muted small">
              {data.Producers.map((producer: any, index: number) => (
                <Link
                  key={index}
                  href={`/producers/${producer.name?.toLowerCase() || ""}`}
                  className="hover-underline"
                >
                  {producer.name}
                  {data.Producers && data.Producers.length - 1 === index
                    ? ""
                    : ", "}
                </Link>
              ))}
            </p>
          )}
        </div>
      </div>

      <ul className="list__option text-white">
        {duration && <li className="me-3">{audioDuration || "0:00"}</li>}
        {dropdown && (
          <li>
            <button
              className="btn btn-icon text-white"
              data-bs-toggle="dropdown"
            >
              <RiMoreFill size={18} />
            </button>
            <ul className="dropdown-menu dropdown-menu-sm bg-dark">
              {download && (
                <li>
                  {ownershipStatus.isPurchased ? (
                    <button className="dropdown-item text-white menu-item-hover">
                      <RiDownloadLine size={18} className="me-1" />
                      Download
                    </button>
                  ) : ownershipStatus.isOwned ? (
                    <button className="dropdown-item text-white menu-item-hover disabled">
                      <RiDownloadLine size={18} className="me-1" />
                      Owned
                    </button>
                  ) : (
                    <button
                      className="dropdown-item text-white menu-item-hover"
                      onClick={handlePurchaseClick}
                    >
                      {ownershipStatus.buttonText}
                    </button>
                  )}
                </li>
              )}
              <li>
                <button className="dropdown-item text-white menu-item-hover">
                  Share
                </button>
              </li>
              <li>
                <Link
                  href="/report"
                  className="dropdown-item text-white menu-item-hover"
                >
                  Report
                </Link>
              </li>
            </ul>
          </li>
        )}
      </ul>

      <style jsx global>{`
        .hover-underline:hover {
          text-decoration: underline !important;
        }
        .dropdown-item.disabled {
          cursor: not-allowed;
          opacity: 0.7;
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
};

TrackList.propTypes = propTypes as any;
TrackList.displayName = "TrackList";

export default TrackList;

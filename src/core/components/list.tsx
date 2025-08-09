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
import { InfoType } from "@/core/types";
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
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
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
    return responseData;
  };

  return (
    <div className="list__item">
      <div className="list__cover">
        <div className="ratio ratio-1x1">
          <Image
            src={data.cover}
            width={320}
            height={320}
            alt={data.title ? data.title : data.name}
          />
        </div>

        {play && (
          <PlayButton className="p-2 border-0" iconSize={16} track={data} />
        )}
      </div>

      <div className="list__content text-white">
        {number && <span className="list__number me-3">{number}.</span>}
        <Link
          href={trackUrl}
          className="list__title text-truncate text-white text-decoration-none hover-underline"
        >
          {data.title ? data.title : data.name}
        </Link>
        {data.Producers && (
          <div className="list__subtitle text-truncate text-white">
            {data.Producers.map((producer: InfoType, index: number) => (
              <Link
                key={index}
                href={`/producers/${encodeURIComponent(producer.name.toLowerCase())}`}
                className="text-secondary text-decoration-none hover-underline"
              >
                {producer.name}
                {data.Producers.length - 1 === index ? "" : ", "}
              </Link>
            ))}
          </div>
        )}
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
                  {data.purchased ? (
                    <button className="dropdown-item text-white menu-item-hover">
                      <RiDownloadLine size={18} className="me-1" />
                      Download
                    </button>
                  ) : (
                    <button
                      className="dropdown-item text-white menu-item-hover"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowStemsModal(true);
                      }}
                    >
                      Purchase Sample
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
      `}</style>

      <StemsPurchaseModal
        isOpen={showStemsModal}
        onClose={() => setShowStemsModal(false)}
        onPurchaseWithStems={() => handlePurchase(7.5)}
        onPurchaseAudioOnly={() => handlePurchase(2.5)}
      />
    </div>
  );
};

TrackList.propTypes = propTypes as any;
TrackList.displayName = "TrackList";

export default TrackList;

"use client";

import PlayButton from "@/core/components/audio-player/play";
import TrackDropdown from "@/core/components/dropdown";
import LoadingSpinner from "@/core/components/loading-spinner";
import StemsPurchaseModal from "@/core/components/modals/stems-purchase-modal";
import { InfoType } from "@/core/types";
import {
  fetchTrackPurchaseStatus,
  getTrackOwnershipStatus,
} from "@/core/utils/track-helpers";
import { useTracks } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

let WaveSurfer: any;
if (typeof window !== "undefined") {
  WaveSurfer = require("wavesurfer.js");
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const SamplePage = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);
  const params = useParams();
  const { slug, sample } = params;
  const { tracks, loading } = useTracks();
  const [waveformReady, setWaveformReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showStemsModal, setShowStemsModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{
    hasAudio: boolean;
    hasStems: boolean;
  }>({ hasAudio: false, hasStems: false });
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  const track = tracks?.find(
    (t: any) =>
      t.title?.toLowerCase() ===
        decodeURIComponent(sample as string).toLowerCase() &&
      t.Producers?.some(
        (p: any) =>
          p.name.toLowerCase() ===
          decodeURIComponent(slug as string).toLowerCase()
      )
  );

  // Derive ownership/purchase CTA state
  const ownershipStatus = getTrackOwnershipStatus(track, user, purchaseStatus);

  const handlePlay = () => {
    if (wavesurfer.current) {
      // If at end of track, seek to start before playing
      if (
        wavesurfer.current.getCurrentTime() >= wavesurfer.current.getDuration()
      ) {
        wavesurfer.current.seekTo(0);
      }
      wavesurfer.current.playPause();
    }
  };

  const getTrackAudioUrl = (track: any) => {
    if (track.src) return track.src;
    if (track.audio?.data?.attributes?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${track.audio.data.attributes.url}`;
    }
    return null;
  };

  const handlePurchase = async (amount: any) => {
    if (!track) return { success: false, message: "No track found" };
    // Check if user is logged in
    if (!user) {
      router.push("/auth/login");
      return { success: false, message: "User not logged in" };
    }
    // Use the credits use api
    const response = await fetch("/api/credits/use", {
      method: "POST",
      body: JSON.stringify({
        amount,
        trackId: track.id,
        jwt: localStorage.getItem("jwt"),
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to purchase sample");
    }

    const data = await response.json();

    // Immediately refresh purchase status so UI updates without reload
    try {
      const status = await fetchTrackPurchaseStatus(track.id);
      setPurchaseStatus(status);
    } catch (err) {
      console.warn("Failed to refresh purchase status after purchase", err);
    }

    return data;
  };

  // Load purchase status for this track
  useEffect(() => {
    (async () => {
      if (!user || !track?.id) {
        setPurchaseStatus({ hasAudio: false, hasStems: false });
        return;
      }
      const status = await fetchTrackPurchaseStatus(track.id);
      setPurchaseStatus(status);
    })();
  }, [user?.id, track?.id]);

  useEffect(() => {
    if (track && waveformRef.current && !wavesurfer.current) {
      const url = getTrackAudioUrl(track);
      if (!url) return;

      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4a4a4a",
        progressColor: "#f50",
        cursorColor: "#f50",
        barWidth: 2,
        barHeight: 1,
        barGap: 3,
        height: 40,
        barRadius: 2,
        normalize: true,
        interact: true,
        fillParent: true,
        responsive: true,
        hideScrollbar: true,
        dragToSeek: true,
        cursorWidth: 2,
      });

      wavesurfer.current = ws;
      ws.load(url);

      ws.on("ready", () => {
        setWaveformReady(true);
        setDuration(ws.getDuration());
      });

      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => {
        setIsPlaying(false);
        ws.seekTo(0);
        setCurrentTime(0);
      });

      ws.on("audioprocess", () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on("seek", () => {
        if (!ws.isPlaying()) {
          setCurrentTime(ws.getCurrentTime());
        }
      });

      ws.on("interaction", () => {
        if (ws.isPlaying()) {
          ws.play();
        }
      });
    }

    return () => {
      if (wavesurfer.current) {
        try {
          if (
            wavesurfer.current &&
            typeof wavesurfer.current.destroy === "function"
          ) {
            try {
              if (
                wavesurfer.current &&
                typeof wavesurfer.current.destroy === "function" &&
                !wavesurfer.current.isDestroyed
              ) {
                try {
                  try {
                    wavesurfer.current.destroy();
                  } catch (e) {
                    if (
                      e &&
                      typeof e === "object" &&
                      "name" in e &&
                      e.name === "AbortError"
                    ) {
                      // Ignore AbortError
                    } else {
                      throw e;
                    }
                  }
                } catch (e) {
                  // Ignore error
                }
              }
            } catch (err) {
              // Ignore AbortError or any error on destroy
            }
          }
        } catch (e) {
          console.error("Error destroying wavesurfer:", e);
        }
        wavesurfer.current = null;
      }
    };
  }, [track]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!track) {
    return <div className="container py-5">Track not found</div>;
  }

  return (
    <React.Fragment>
      <div className="container" style={{ marginTop: "120px" }}>
        <div className="bg-dark rounded-4 p-4 mb-4">
          <div className="row align-items-start">
            {/* Cover image column */}
            <div className="col-md-auto d-flex justify-content-center mb-4 mb-md-0">
              <div
                className="position-relative"
                style={{ width: 300, height: 300, minWidth: 300 }}
              >
                <Image
                  src={track.cover || "/images/users/audiodefault.jpg"}
                  width={300}
                  height={300}
                  alt={track.title}
                  className="rounded-3 shadow"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    border: "2px solid #222",
                  }}
                />
              </div>
            </div>
            {/* Data column */}
            <div className="col-md" style={{ minWidth: 0 }}>
              <div className="mb-3">
                <h1 className="h2 mb-2 text-truncate">{track.title}</h1>
                <Link
                  href={`/producers/${track.Producers?.[0]?.name?.toLowerCase()}`}
                  className="text-primary text-decoration-none h5 mb-0 text-truncate d-inline-block"
                  style={{ maxWidth: "100%" }}
                >
                  {track.Producers?.[0]?.name}
                </Link>
              </div>
              <div className="d-flex gap-3 flex-wrap mb-4">
                {track.genre &&
                  Array.isArray(track.genre) &&
                  track.genre.length > 0 && (
                    <div className="px-3 py-1 rounded bg-dark-subtle text-nowrap">
                      {track.genre.map((g: InfoType) => g.name).join(", ")}
                    </div>
                  )}
                {track.bpm && (
                  <div className="px-3 py-1 rounded bg-dark-subtle text-nowrap">
                    {track.bpm} BPM
                  </div>
                )}
                {track.keys && track.keys.length > 0 && (
                  <div className="px-3 py-1 rounded bg-dark-subtle text-nowrap">
                    {Array.isArray(track.keys)
                      ? track.keys.join(", ")
                      : track.keys}
                  </div>
                )}
                {track.moods && track.moods.length > 0 && (
                  <div className="px-3 py-1 rounded bg-dark-subtle text-nowrap">
                    {Array.isArray(track.moods)
                      ? track.moods.join(", ")
                      : track.moods}
                  </div>
                )}
              </div>
              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <button
                  className="btn btn-outline-light px-4"
                  onClick={() => {
                    // If already fully purchased or owned, do nothing
                    if (ownershipStatus.buttonDisabled) return;
                    setShowStemsModal(true);
                  }}
                  disabled={ownershipStatus.buttonDisabled}
                >
                  {ownershipStatus.buttonText}
                </button>
                <TrackDropdown
                  data={track}
                  className="dropdown"
                  btnClassName="btn btn-icon"
                  iconVertical={false}
                />
              </div>
              {/* Audio player section - restructured */}
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center">
                  <div
                    className="me-4 d-flex align-items-center"
                    style={{ height: "80px" }}
                  >
                    <PlayButton
                      track={track}
                      iconSize={32}
                      primaryButton
                      onClick={handlePlay}
                      showPause={isPlaying}
                    />
                  </div>
                  <div className="flex-grow-1 position-relative">
                    <div
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                        height: "80px",
                        minWidth: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        ref={waveformRef}
                        style={{
                          width: "100%",
                          minWidth: 0,
                          maxWidth: "100%",
                          opacity: waveformReady ? 1 : 0.5,
                          transition: "opacity 0.3s ease",
                          overflow: "hidden",
                          boxSizing: "border-box",
                        }}
                      />
                      {!waveformReady && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <LoadingSpinner />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Time display moved below both elements */}
                <div
                  className="d-flex justify-content-between mt-2"
                  style={{ marginLeft: 72 }}
                >
                  <small style={{ color: "#fff" }}>
                    {formatTime(currentTime)}
                  </small>
                  <small style={{ color: "#fff" }}>
                    {formatTime(duration)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </React.Fragment>
  );
};

export default SamplePage;

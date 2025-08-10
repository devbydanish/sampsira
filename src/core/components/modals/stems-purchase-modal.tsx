"use client";

import { RiDownload2Line, RiFolderMusicLine } from "@remixicon/react";
import React from "react";
import ModalPortal from "./modal-portal";

interface StemsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseWithStems: () => Promise<any>;
  onPurchaseAudioOnly?: () => Promise<any>;
  // When true, only show the stems upgrade button (audio already purchased)
  showOnlyStemsOption?: boolean;
}

const StemsPurchaseModal: React.FC<StemsPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseWithStems,
  onPurchaseAudioOnly,
  showOnlyStemsOption = false,
}) => {
  const [showDownload, setShowDownload] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) setShowDownload(false);
  }, [isOpen]);

  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [stemsUrl, setStemsUrl] = React.useState<string | null>(null);
  const [licenseUrl, setLicenseUrl] = React.useState<string | null>(null);

  const handlePurchaseWithStems = async () => {
    const response = await onPurchaseWithStems();
    if (response.success) {
      setShowDownload(true);
      setAudioUrl(response.track_url || null);
      setStemsUrl(response.stems_url || null);
      setLicenseUrl(response.licenseUrl || null);
    }
  };

  const handlePurchaseAudioOnly = async () => {
    if (!onPurchaseAudioOnly) return;
    const response = await onPurchaseAudioOnly();
    if (response?.success) {
      setShowDownload(true);
      setAudioUrl(response.track_url || null);
      setStemsUrl(null);
      setLicenseUrl(response.licenseUrl || null);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      window.open(`${audioUrl}`, "_blank");
    }
  };

  const downloadStems = () => {
    if (stemsUrl) {
      window.open(`${stemsUrl}`, "_blank");
    }
  };

  const downloadLicense = () => {
    if (licenseUrl) {
      fetch(licenseUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "license.pdf";
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading license:", error);
        });
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="modal show d-block"
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered mx-auto"
          style={{ maxWidth: 480, margin: "0 15px", width: "100%" }}
        >
          <div className="modal-content bg-dark">
            <div className="modal-header border-bottom border-secondary">
              <h5 className="modal-title text-white">
                {showDownload
                  ? "Thank You For Your Purchase"
                  : "Purchase Options"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>
            <div className="modal-body text-center">
              {showDownload ? (
                <>
                  <h2 className="text-white mb-3">Download Your Files</h2>
                  <span
                    className="icon-bg-square d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      background: "#23232b",
                      borderRadius: "12px",
                      width: 64,
                      height: 64,
                    }}
                  >
                    <RiDownload2Line size={36} className="text-primary" />
                  </span>
                  <p className="text-white mb-4">
                    Your purchase was successful! Click below to download your
                    files. You can also access your downloads from your account
                    at any time.
                  </p>
                  {stemsUrl ? (
                    <div className="d-flex gap-3 flex-column flex-md-row">
                      {audioUrl && (
                        <button
                          type="button"
                          className="btn btn-primary w-100 text-white"
                          onClick={downloadAudio}
                        >
                          Download Audio
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-light w-100"
                        onClick={downloadStems}
                      >
                        Download Stems
                      </button>
                      {licenseUrl && (
                        <button
                          type="button"
                          className="btn btn-outline-light w-100"
                          onClick={downloadLicense}
                        >
                          Download License
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex gap-3 flex-column flex-md-row">
                      <button
                        type="button"
                        className="btn btn-primary w-100 text-white"
                        onClick={downloadAudio}
                      >
                        Download Audio
                      </button>
                      {licenseUrl && (
                        <button
                          type="button"
                          className="btn btn-outline-light w-100"
                          onClick={downloadLicense}
                        >
                          Download License
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span
                    className="icon-bg-square d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      background: "#23232b",
                      borderRadius: "12px",
                      width: 64,
                      height: 64,
                    }}
                  >
                    <RiFolderMusicLine size={36} className="text-primary" />
                  </span>
                  {showOnlyStemsOption ? (
                    <div className="d-flex justify-content-between gap-3 mt-4 flex-column flex-md-row">
                      <button
                        type="button"
                        className="w-100 h-auto btn btn-primary text-white"
                        onClick={handlePurchaseWithStems}
                      >
                        Buy Stems (5 credits)
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-white">
                        Would you like to include the stems for an additional 5
                        credits?
                      </p>
                      <div className="d-flex justify-content-between gap-3 mt-4 flex-column flex-md-row">
                        <button
                          type="button"
                          className="w-100 h-auto btn btn-primary text-white mb-3 mb-md-0"
                          onClick={handlePurchaseWithStems}
                        >
                          Yes, include stems
                        </button>
                        <button
                          type="button"
                          className="w-100 btn btn-outline-light"
                          onClick={handlePurchaseAudioOnly}
                        >
                          No thanks, purchase audio only
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <style jsx global>{`
          .modal {
            background-color: rgba(0, 0, 0, 0.5);
          }
          @media (max-width: 576px) {
            .modal-dialog {
              margin: 0 15px;
              max-width: calc(100% - 30px) !important;
            }
          }
        `}</style>
      </div>
    </ModalPortal>
  );
};

export default StemsPurchaseModal;

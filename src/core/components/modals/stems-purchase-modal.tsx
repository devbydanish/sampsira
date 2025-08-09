"use client";

import { RiDownload2Line, RiFolderMusicLine } from "@remixicon/react";
import React from "react";
import ModalPortal from "./modal-portal";

interface StemsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseWithStems: () => Promise<any>;
  onPurchaseAudioOnly: () => Promise<any>;
}

const StemsPurchaseModal: React.FC<StemsPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseWithStems,
  onPurchaseAudioOnly,
}) => {
  const [showDownload, setShowDownload] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) setShowDownload(false);
  }, [isOpen]);

  const [track, setTrack] = React.useState<any>(null);

  const handlePurchaseWithStems = async () => {
    const response = await onPurchaseWithStems();
    if (response.success) {
      setShowDownload(true);
      setTrack(response.track_url);
    }
  };

  const handlePurchaseAudioOnly = async () => {
    const response = await onPurchaseAudioOnly();

    if (response.success) {
      setShowDownload(true);
      setTrack(response.track_url);
    }
  };

  const downloadFile = () => {
    if (track) {
      window.open(`${process.env.NEXT_PUBLIC_STRAPI_URL}${track}`, "_blank");
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
                  <button
                    type="button"
                    className="btn btn-primary w-100 text-white"
                    onClick={downloadFile}
                  >
                    Download Files
                  </button>
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

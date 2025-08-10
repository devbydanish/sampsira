"use client";

import { useAuthentication } from "@/core/contexts/authentication";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const Licenses = () => {
  const locale = useTranslations();
  const { currentUser } = useAuthentication();
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [editState, setEditState] = useState<any>(null);

  // State for purchased licenses
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);

  // Fetch licenses when the licenses tab is active
  useEffect(() => {
    const fetchLicenses = async () => {
      setIsLoadingLicenses(true);
      try {
        const response = await fetch("/api/license", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Support both shapes: array payload or { data: [...] }
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data.map((item: any) => ({
                  id: item?.id,
                  ...(item?.attributes || {}),
                }))
              : [];
          setLicenses(list);
        } else {
          console.error("Failed to fetch licenses");
        }
      } catch (error) {
        console.error("Error fetching licenses:", error);
      } finally {
        setIsLoadingLicenses(false);
      }
    };

    fetchLicenses();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="card-body">
      <h5 className="mb-4 text-black">My Licenses</h5>

      <div>
        {Array.isArray(licenses) && licenses.length > 0 ? (
          <div className="table-responsive licenses-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Date Purchased</th>
                  <th>Sample Name</th>
                  <th>Owner</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => {
                  const purchaseDate =
                    license.purchaseDate ?? license?.attributes?.purchaseDate;
                  const sampleName =
                    license.sampleName ?? license?.attributes?.sampleName;
                  const ownerUsername =
                    license?.owner?.username ??
                    license?.attributes?.owner?.data?.attributes?.username;
                  const licenseUrl =
                    license.licenseUrl ?? license?.attributes?.licenseUrl;
                  const wavUrl = license.wavUrl ?? license?.attributes?.wavUrl;
                  const stemsUrl =
                    license.stemsUrl ?? license?.attributes?.stemsUrl;
                  return (
                    <tr key={license.id}>
                      <td>{formatDate(purchaseDate)}</td>
                      <td>{sampleName}</td>
                      <td>{ownerUsername}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary text-white"
                          onClick={() => {
                            if (!licenseUrl) return;
                            fetch(licenseUrl, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                              },
                            })
                              .then((res) => res.blob())
                              .then((blob) => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "license.pdf";
                                a.click();
                                window.URL.revokeObjectURL(url);
                              })
                              .catch((err) =>
                                console.error("Error downloading license:", err)
                              );
                          }}
                          disabled={!licenseUrl}
                        >
                          <i className="ri-file-text-line me-1"></i>
                          {locale("view_license")}
                        </button>
                        {/* Download Dropdown */}
                        <div className="btn-group ms-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Download
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item text-white"
                                onClick={() =>
                                  wavUrl && window.open(wavUrl, "_blank")
                                }
                                disabled={!wavUrl}
                              >
                                .WAV File
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-white"
                                onClick={() =>
                                  stemsUrl && window.open(stemsUrl, "_blank")
                                }
                                disabled={!stemsUrl}
                              >
                                Stems
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-0">{locale("no_licenses_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Licenses;

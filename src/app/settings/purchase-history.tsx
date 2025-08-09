"use client";

import Tab from "@/core/components/tab";
import { useAuthentication } from "@/core/contexts/authentication";
import Section from "@/view/layout/section";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const PurchaseHistory: React.FC = () => {
  const locale = useTranslations();
  const { currentUser } = useAuthentication();
  const [activeTab, setActiveTab] = useState("samples");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "samples", name: locale("samples_purchases") || "Samples Purchases" },
    { id: "sound_kits", name: locale("all_orders") || "All Orders" },
  ];

  // Fetch user's purchase history
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/purchases", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const dataRes = await response.json();
        if (dataRes.ok) {
          console.log("dataRes", dataRes);
          const transaction = dataRes.data.map((item: any) => ({
            ...item.attributes,
            ...item,
          }));
          console.log("transaction", transaction);
          setTransactions(transaction);
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const purchasedSamples = transactions
    .filter((t) => t.type === "purchase")
    .map((t) => ({
      ...t,
      title: "Sample: " + t.track.data?.attributes.title,
      cover: { url: "/images/cover/default.jpg" },
    }));

  const purchasedSoundKits = transactions;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="card-body">
      <h5 className="mb-4 text-black">Purchase History</h5>
      <Tab id="purchase-history">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              id={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          </li>
        ))}
      </Tab>

      <div className="tab-content p-4">
        <div
          className={`tab-pane fade ${activeTab === "samples" ? "show active" : ""}`}
        >
          {purchasedSamples.length > 0 ? (
            <Section
              title=""
              data={purchasedSamples}
              card="track"
              slideView={4}
              navigation
            />
          ) : (
            <div className="text-center">
              <p className="mb-0">{locale("no_samples_purchased")}</p>
            </div>
          )}
        </div>
        <div
          className={`tab-pane fade ${activeTab === "sound_kits" ? "show active" : ""}`}
        >
          {purchasedSoundKits.length > 0 ? (
            <div className="table-responsive bg-white">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasedSoundKits.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {transaction.type}
                      </td>
                      <td>{transaction.itemName}</td>
                      <td>{formatCurrency(transaction.amount)}</td>
                      <td>
                        {transaction.invoiceUrl && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              window.open(transaction.invoiceUrl, "_blank")
                            }
                          >
                            View Invoice
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-0">{locale("no_orders_found")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;

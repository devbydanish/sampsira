"use client";

// Modules
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

// Components
import { Table, Button, Dropdown, DropdownButton, Form } from "react-bootstrap";

// Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function AnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState("Tracks");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [searchTerm, setSearchTerm] = useState("");

  const summaryData = [
    { label: "Tracks", value: "1", change: "0%" },
    { label: "Sound Kits", value: "244", change: "+10.41%" },
    { label: "Likes", value: "3", change: "-40.00%" },
    { label: "Downloads", value: "727", change: "-21.83%" },
    { label: "Total Income", value: "$33.50", change: "0%" },
  ];

  const chartData = {
    labels: [
      "2025-01-31",
      "2025-02-01",
      "2025-02-02",
      "2025-02-03",
      "2025-02-04",
      "2025-02-05",
      "2025-02-06",
    ],
    datasets: [
      {
        label: activeMetric,
        data:
          activeMetric === "Downloads"
            ? [5, 10, 15, 20, 25, 30, 35]
            : [2, 4, 6, 8, 10, 12, 14],
        backgroundColor: "orange",
      },
    ],
  };

  const handleMetricClick = (metric: string) => {
    setActiveMetric(metric);
  };

  return (
    <div className="analytics-container mt-5 py-5">
      <h2 className="mb-4">Analytics & Earnings</h2>

      {/* Date Range Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <DropdownButton
          title={selectedRange}
          onSelect={(range) => setSelectedRange(range as string)}
          className="filter-dropdown"
        >
          {[
            "Last 7 Days",
            "Last 14 Days",
            "Last 30 Days",
            "Last 60 Days",
            "Last 90 Days",
            "Last 365 Days",
            "Custom",
          ].map((range) => (
            <Dropdown.Item key={range} eventKey={range}>
              {range}
            </Dropdown.Item>
          ))}
          {selectedRange === "Custom" && (
            <div className="date-picker-container">
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="form-control"
              />
              <span className="mx-2">to</span>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="form-control"
              />
            </div>
          )}
        </DropdownButton>
      </div>

      {/* Summary Cards & Chart Layout */}
      <div className="row">
        {/* Left Column - Summary Cards */}
        <div className="col-lg-6 summary-section">
          <div className="row">
            {summaryData.map((item, index) => (
              <div
                className={`col-md-${item.label === "Total Income" ? "12" : "6"} mb-3`}
                key={item.label}
              >
                <div
                  className={`summary-card ${activeMetric === item.label ? "active" : ""}`}
                  onClick={() => handleMetricClick(item.label)}
                >
                  <h5>{item.label}</h5>
                  <h5>{item.value}</h5>
                  <p className={item.change.includes("-") ? "text-danger" : "text-success"}>
                    {item.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Chart */}
        <div className="col-lg-6 chart-container mb-3">
          <Bar data={chartData} />
        </div>
      </div>

      {/* Track Table */}
      <h3 className="mt-5">Tracks</h3>
      <Form.Control
        type="text"
        placeholder="Search tracks..."
        className="track-search mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table striped bordered hover className="tracks-table">
        <thead>
          <tr className="table-header">
            <th>Track Title</th>
            <th>Likes</th>
            <th>Credits</th>
            <th>Downloads</th>
            <th>Total Earned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              title: "Reggaeton Type Beat 98BPM",
              artist: "Feniko",
              likes: "1",
              credits: "134",
              downloads: "665",
              earnings: "$33.50",
              image: "/images/tracks/reggaeton.jpg",
            },
            {
              title: "Dark Trap Type Beat 90BPM",
              artist: "Feniko",
              likes: "0",
              credits: "0",
              downloads: "3",
              earnings: "$0.00",
              image: "/images/tracks/darktrap.jpg",
            },
          ]
            .filter((track) => track.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((track, index) => (
              <tr key={index}>
                <td className="track-info">
                  <img src={track.image} alt={track.title} className="track-image" />
                  <div className="track-details">
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                </td>
                <td>{track.likes}</td>
                <td>{track.credits}</td>
                <td>{track.downloads}</td>
                <td>{track.earnings}</td>
                <td>
                  <Button variant="primary">View Insights</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

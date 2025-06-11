"use client";

// Modules
import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";

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

interface User {
  id: number;
  credits: number;
  totalIncome: number;
  total_withdrawn: number;
  tracks: any[];
}

interface Track {
  id: number;
  attributes: {
    title: string;
    credits: number;
    isSoundKit: boolean;
    user: {
      data: {
        id: number;
        attributes: {
          username: string;
        }
      }
    }
    cover: {
      data: {
        attributes: {
          formats: {
            thumbnail: {
              url: string;
            }
          }
          url: string;
        }
      }
    }
  }
}

export default function AnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState("Tracks");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackCount, setTrackCount] = useState(0);
  const [soundKitCount, setSoundKitCount] = useState(0);


  // Update counts when user data changes
  useEffect(() => {
    if (user?.tracks) {
      const tracks = user.tracks;
      const regularTracks = tracks.filter(track => !track?.isSoundKit);
      const soundKits = tracks.filter(track => track?.isSoundKit);
      
      setTrackCount(regularTracks.length);
      setSoundKitCount(soundKits.length);
    }

    
  }, [user?.id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleWithdraw = async () => {
    if (!user || user.totalIncome < 50) {
      toast.warning('Minimum withdrawal amount is $50');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          total_withdrawn: (user.total_withdrawn || 0) + incomeEarned,
          credits: 0
        })
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast.success('Withdrawal processed successfully!');
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);
      setError('Failed to process withdrawal');
    }
  };

  const credits = user?.credits || 0;
  const incomeEarned = credits * 0.50;
  const totalWithdrawn = user?.total_withdrawn || 0;
  
  const summaryData = [
    { label: "Sound Kits", value: soundKitCount.toString(), change: "0%" },
    { label: "Tracks", value: trackCount.toString(), change: "0%" },
    { label: "Credits", value: credits.toString(), change: "0%" },
    { label: "Income Earned", value: `$${incomeEarned.toFixed(2)}`, change: null },
    { label: "Total Withdrawn", value: `$${totalWithdrawn.toFixed(2)}`, change: null },
  ];

  const canWithdraw = incomeEarned >= 50;

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

  // Calculate total earned for each track
  const calculateEarnings = (credits: number) => {
    return (credits * 0.50).toFixed(2);
  };

  return (
    <div className="container">
      <div className="analytics-container mt-5 py-5">
      <h2 className="mb-4">Analytics & Earnings</h2>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

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
                className={`${
                  item.label === "Total Withdrawn"
                    ? "col-md-12"
                    : "col-md-6"
                } mb-3`}
                key={item.label}
              >
                <div
                  className={`summary-card ${activeMetric === item.label ? "active" : ""}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    height: item.label === "Total Withdrawn" ? 'auto' : '140px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: item.label === "Total Withdrawn" ? '1rem' : '0.5rem'
                  }}
                  onClick={() => item.label !== "Income Earned" && handleMetricClick(item.label)}
                >
                  <div style={{ textAlign: 'center', marginBottom: 'auto', marginTop: 'auto' }}>
                    <h5 style={{ marginBottom: '0.5rem' }}>{item.label}</h5>
                    <h5 style={{ marginBottom: '0.5rem' }}>{item.value}</h5>
                    {item.change && (
                      <p className={item.change.includes("-") ? "text-danger" : "text-success"} style={{ marginBottom: 0 }}>
                        {item.change}
                      </p>
                    )}
                  </div>
                  {item.label === "Income Earned" && (
                    <div style={{ width: '100%', marginTop: 'auto' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#ff6b00',
                        color: 'white',
                        border: 'none',
                        opacity: canWithdraw ? 1 : 0.5,
                        transition: 'opacity 0.3s ease',
                        width: '100%',
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.5rem',
                        marginTop: '0.5rem'
                      }}
                      disabled={!canWithdraw}
                      onClick={handleWithdraw}
                    >
                      {canWithdraw ? 'Withdraw' : 'Need $50 to withdraw'}
                    </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Chart */}
        <div className="col-lg-6 chart-container mb-3" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px'
        }}>
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
            <th>Credits</th>
            <th>Total Earned</th>
          </tr>
        </thead>
        <tbody>
          {user?.tracks && user.tracks.length > 0 ? (
            user.tracks
              .filter((track) => 
                track.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((track) => (
                <tr key={track.id}>
                  <td className="track-info">
                    <div className="track-details">
                      <span className="track-title">{track.title}</span>
                    </div>
                  </td>
                  <td>{track.credits || 0}</td>
                  <td>${calculateEarnings(track.credits || 0)}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">No tracks found</td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </div>
  );
}

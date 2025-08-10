"use client";

// Modules
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Components
import { Dropdown, DropdownButton, Form, Table } from "react-bootstrap";
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
  total_withdraw: number;
  tracks: any[];
  totalCredits?: number; // Add totalCredits property
}

interface Track {
  id: number;
  attributes: {
    title: string;
    credits: number;
    isSoundKit: boolean;
    createdAt: string;
    bpm?: number;
    genre?: {
      data: Array<{
        attributes: {
          name: string;
        }
      }>
    };
    user: {
      data: {
        id: number;
        attributes: {
          username: string;
        };
      };
    };
    cover: {
      data: {
        attributes: {
          formats: {
            thumbnail: {
              url: string;
            };
          };
          url: string;
        };
      };
    };
  };
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Date range mapping
  const rangeOptions = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 14 Days", days: 14 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 60 Days", days: 60 },
    { label: "Last 90 Days", days: 90 },
    { label: "Last 365 Days", days: 365 },
    { label: "All Time", days: null }
  ];

  function getRangeDates(rangeLabel: string) {
    if (rangeLabel === "All Time") return { start: null, end: new Date() };
    const option = rangeOptions.find(opt => opt.label === rangeLabel);
    if (!option) return { start: null, end: new Date() };
    const end = new Date();
    if (option.days === null) return { start: null, end };
    const start = new Date();
    start.setDate(end.getDate() - option.days + 1);
    return { start, end };
  }


  // Update counts when user data changes
  useEffect(() => {
    if (user?.tracks) {
      let { start, end } = getRangeDates(selectedRange);

      // For "All Time", set start to earliest track date
      if (selectedRange === "All Time" && user.tracks.length > 0) {
        const dates = user.tracks
          .map(track => track.createdAt)
          .filter(Boolean)
          .map(date => new Date(date));
        if (dates.length > 0) {
          start = new Date(Math.min(...dates.map(d => d.getTime())));
        }
      }

      const filteredTracks = user.tracks.filter(track => {
        if (!track.createdAt || !start) return true;
        const created = new Date(track.createdAt);
        return created >= start && created <= end;
      });

      const regularTracks = filteredTracks.filter(track => !track?.isSoundKit);
      const soundKits = filteredTracks.filter(track => track?.isSoundKit);

      setTrackCount(regularTracks.length);
      setSoundKitCount(soundKits.length);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=tracks,tracks.cover,tracks.audio,tracks.genre`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        );
        const data = await response.json();
        console.log('User data:', data);
        console.log('User tracks:', data.tracks);

        // Calculate total credits directly when setting user data
        if (data.tracks && Array.isArray(data.tracks)) {
          let totalCredits = 0;
          data.tracks.forEach((track: any) => {
            const trackCredits = Number(track.credits_earned || track.credits || 0);
            console.log(`Track ${track.title}: ${trackCredits} credits`);
            totalCredits += trackCredits;
          });
          console.log('Calculated total credits:', totalCredits);
          // Add the total credits to the user object
          data.totalCredits = totalCredits;
        }

        setUser(data);
        setPendingAmount(data.pending_amount);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
      }
    };
    fetchUser();
  }, []);

  const handleWithdraw = async () => {
    if (!user || incomeEarned < 50) {
      toast.warning('Minimum withdrawal amount is $50');
      return;
    }


    try {
      const response = await fetch(`/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          total_withdrawn: (user.total_withdrawn || 0) + incomeEarned,
          credits: 0
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Preserve existing tracks data while updating the user state
        setUser({
          ...user,
          total_withdrawn: updatedUser.total_withdrawn,
          credits: updatedUser.credits,
          tracks: user.tracks // Ensure tracks remain unchanged
        });
        // Transfer incomeEarned to pendingAmount
        setPendingAmount(incomeEarned);
        // Reset incomeEarned to 0
        setIncomeEarned(0);
        toast.success('Withdrawal processed successfully!');
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
      setError("Failed to process withdrawal");
    }
  };

  // Calculate total credits and income from all tracks
  const [pendingAmount, setPendingAmount] = useState(0);
  const [incomeEarned, setIncomeEarned] = useState(0);
  const totalWithdrawn = user?.total_withdrawn || 0;

  // Filter tracks by selected range
  const { start: filterStart, end: filterEnd } = getRangeDates(selectedRange);
  const filteredTracks = user?.tracks?.filter(track => {
    if (!track.createdAt || !filterStart) return true;
    const created = new Date(track.createdAt);
    return created >= filterStart && created <= filterEnd;
  }) || [];

  console.log('Filtered tracks:', filteredTracks);
  console.log('User tracks structure:', user?.tracks?.[0]);

  // Calculate total credits from all tracks
  // Sum all credits from all tracks regardless of structure
  // Use the pre-calculated total credits from the user object if available
  // Otherwise, calculate it from the tracks
  const totalTrackCredits = user?.totalCredits || (user?.tracks || []).reduce((sum, track) => {
    // Try to get credits from different possible locations in the track object
    let credits = 0;

    if (track.credits_earned !== undefined) {
      credits = track.credits_earned;
    } else if (track.credits !== undefined) {
      credits = track.credits;
    } else if (track.attributes && track.attributes.credits !== undefined) {
      credits = track.attributes.credits;
    }

    // Convert to number and add to sum
    const numCredits = Number(credits) || 0;
    console.log('Track:', track.title, 'Credits found:', numCredits);
    return sum + numCredits;
  }, 0);

  console.log('Final total track credits:', totalTrackCredits);

  // Calculate total income (10% of credits)
  const totalTrackIncome = totalTrackCredits * 0.10;
  console.log('Final total track income:', totalTrackIncome);

  useEffect(() => {
    setIncomeEarned(totalTrackIncome);
    // Initialize pendingAmount to 0 instead of totalTrackIncome
    setPendingAmount(0);
  }, [totalTrackIncome, selectedRange]);

  // Force numeric values for display
  const displayCredits = Number(totalTrackCredits) || 0;
  // Use incomeEarned state variable for display instead of totalTrackIncome
  const displayIncome = Number(incomeEarned) || 0;

  const summaryData = [
    { label: "Tracks", value: (user?.tracks?.length || 0).toString(), change: "0%" },
    { label: "Credits", value: displayCredits.toString(), change: "0%" },
    { label: "Income Earned", value: `$${displayIncome.toFixed(2)}`, change: null },
    { label: "Amount Pending", value: `$${pendingAmount.toFixed(2)}`, change: null },
    { label: "Total Withdrawn", value: `$${totalWithdrawn.toFixed(2)}`, change: null },
  ];

  // Disable withdraw button if there's a pending amount or if income earned is less than $50
  const canWithdraw = incomeEarned >= 50 && pendingAmount === 0;

  // Chart data for filtered tracks by date
  function getDateArray(start: Date, end: Date) {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  let chartLabels: string[] = [];
  let chartDataCounts: number[] = [];

  if (filterStart && filterEnd) {
    // If All Time and no tracks, show empty chart
    if (selectedRange === "All Time" && (!filterStart || !filterEnd)) {
      chartLabels = [];
      chartDataCounts = [];
    } else {
      const dateArr = getDateArray(filterStart, filterEnd);
      chartLabels = dateArr.map(d =>
        d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      );
      chartDataCounts = dateArr.map(d => {
        const dateStr = d.toISOString().split('T')[0];

        // Filter tracks for this date
        const tracksOnDate = filteredTracks.filter(track =>
          track.createdAt && new Date(track.createdAt).toISOString().split('T')[0] === dateStr
        );

        // Return different data based on activeMetric
        switch (activeMetric) {
          case "Tracks":
            // Count tracks uploaded on this date, divide by 10 for chart scaling
            return tracksOnDate.length / 10;

          case "Credits":
            // Sum credits for tracks on this date
            return tracksOnDate.reduce((sum, track) => {
              const credits = Number(track.credits_earned || track.credits || 0);
              return sum + credits;
            }, 0) / 100; // Scale down for chart

          case "Income Earned":
            // Sum income (10% of credits) for tracks on this date
            return tracksOnDate.reduce((sum, track) => {
              const credits = Number(track.credits_earned || track.credits || 0);
              return sum + (credits * 0.1);
            }, 0) / 10; // Scale down for chart

          case "Amount Pending":
            // Show pending amount (only for current date if there is any)
            return dateStr === new Date().toISOString().split('T')[0] ? pendingAmount / 10 : 0;

          case "Total Withdrawn":
            // Show total withdrawn (accumulated over time)
            return totalWithdrawn / 100; // Scale down for chart

          default:
            return tracksOnDate.length / 10;
        }
      });
    }
  }

  const chartData = {
    labels: chartLabels,
    labels: chartLabels,
    datasets: [
      {
        label: activeMetric === "Tracks" ? "Tracks Uploaded" :
               activeMetric === "Credits" ? "Credits Gained" :
               activeMetric === "Income Earned" ? "Income Earned ($)" :
               activeMetric === "Amount Pending" ? "Amount Pending ($)" :
               activeMetric === "Total Withdrawn" ? "Total Withdrawn ($)" :
               "Tracks Uploaded",
        data: chartDataCounts.map(v => v * 10),
        backgroundColor: "orange",
        yAxisID: 'y',
      },
    ],
  };

  // Chart options based on active metric
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: activeMetric === "Tracks" ? 10 :
             activeMetric === "Credits" ? 1000 :
             activeMetric === "Income Earned" ? 100 :
             activeMetric === "Amount Pending" ? 100 :
             activeMetric === "Total Withdrawn" ? 1000 : 10,
        ticks: {
          stepSize: activeMetric === "Tracks" ? 1 :
                    activeMetric === "Credits" ? 100 :
                    activeMetric === "Income Earned" ? 10 :
                    activeMetric === "Amount Pending" ? 10 :
                    activeMetric === "Total Withdrawn" ? 100 : 1,
          callback: function(value: number) {
            if (activeMetric === "Tracks") {
              // Show only whole numbers 1-10
              if (Number.isInteger(value) && value >= 1 && value <= 10) {
                return value.toString();
              }
            } else if (activeMetric === "Credits") {
              // Show multiples of 100 up to 1000
              if (Number.isInteger(value) && value % 100 === 0 && value <= 1000) {
                return value.toString();
              }
            } else if (activeMetric === "Income Earned" || activeMetric === "Amount Pending") {
              // Show multiples of 10 up to 100
              if (Number.isInteger(value) && value % 10 === 0 && value <= 100) {
                return `$${value}`;
              }
            } else if (activeMetric === "Total Withdrawn") {
              // Show multiples of 100 up to 1000
              if (Number.isInteger(value) && value % 100 === 0 && value <= 1000) {
                return `$${value}`;
              }
            }
            return '';
          }
        },
        title: {
          display: true,
          text: activeMetric === "Tracks" ? 'Tracks' :
               activeMetric === "Credits" ? 'Credits' :
               activeMetric === "Income Earned" ? 'Income ($)' :
               activeMetric === "Amount Pending" ? 'Pending ($)' :
               activeMetric === "Total Withdrawn" ? 'Withdrawn ($)' : 'Tracks'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        ticks: {
          stepSize: 10,
          callback: function(value: number) {
            // Show only multiples of 10 from 10 to 100
            if (Number.isInteger(value) && value >= 10 && value <= 100 && value % 10 === 0) {
              return value.toString();
            }
            return '';
          }
        },
        title: {
          display: true,
          text: 'Tens'
        }
      }
    }
  };

  const handleMetricClick = (metric: string) => {
    setActiveMetric(metric);
  };

  // Calculate total earned for each track
  const calculateEarnings = (credits: number) => {
    return (credits * 0.10).toFixed(2);
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
            "All Time",
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
                      {pendingAmount > 0 ? 'Previous amount still pending...' : (incomeEarned >= 50 ? 'Withdraw' : 'Need $50 to withdraw')}
                    </button>
                    </div>
                  )}
                </div>

                {/* Mobile-only Chart Row - Shown only on mobile */}
                <div className="row d-lg-none mb-4">
                  <div className="col-12">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '300px',
                      width: '100%'
                    }}>
                      <Bar data={chartData} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Chart - Hidden on mobile */}
        <div className="col-lg-6 chart-container mb-3 d-none d-lg-flex" style={{
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
      <div className="row">
        <div className="col-12">
          <Form.Control
            type="text"
            placeholder="Search tracks..."
            className="track-search mb-3 w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table striped bordered hover className="tracks-table">
        <thead>
          <tr className="table-header">
            <th>Track Title</th>
            <th>Uploaded On</th>
            <th>Genre</th>
            <th>BPM</th>
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
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((track) => (
                <tr key={track.id}>
                  <td className="track-info">
                    <div className="track-details">
                      <span className="track-title">{track.title}</span>
                    </div>
                  </td>
                  <td>
                    {track.createdAt
                      ? new Date(track.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : ""}
                  </td>
                  <td>
                    {track.genre ? (Array.isArray(track.genre)
                      ? track.genre.map((g: any) => g.name).join(", ")
                      : track.genre) : "-"}
                  </td>
                  <td>{track.bpm || "-"}</td>
                  <td>{track.credits_earned || track.credits || 0}</td>
                  <td>${calculateEarnings(Number(track.credits_earned || track.credits || 0))}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No tracks found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      {user?.tracks && user.tracks.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase())
      ).length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <span className="me-2">Show:</span>
            <select
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              style={{ width: 'auto' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ms-2">per page</span>
          </div>

          <div className="pagination-controls">
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="mx-2">
              Page {currentPage} of {Math.ceil(user.tracks.filter(track =>
                track.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).length / itemsPerPage) || 1}
            </span>

            <button
              className="btn btn-sm btn-outline-secondary ms-1"
              onClick={() => setCurrentPage(prev =>
                Math.min(
                  prev + 1,
                  Math.ceil(user.tracks.filter(track =>
                    track.title.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length / itemsPerPage) || 1
                )
              )}
              disabled={currentPage >= (Math.ceil(user.tracks.filter(track =>
                track.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).length / itemsPerPage) || 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

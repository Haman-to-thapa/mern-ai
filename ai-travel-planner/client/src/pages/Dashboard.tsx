import { useState, useEffect, useOptimistic, useTransition, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTripStore } from "../store/tripStore";
import { useAuthStore } from "../store/authStore";

type ItineraryData = {
  destination?: string;
  destination_city?: string;
  flight_number?: string;
  flights?: { flightNumber?: string; airline?: string; from?: string; to?: string; departureDate?: string; departureTime?: string; arrivalTime?: string }[];
  airline?: string;
  hotel_name?: string;
  hotels?: { hotelName?: string; checkInDate?: string; checkOutDate?: string }[];
  departure_date?: string;
  travelDates?: { startDate?: string; endDate?: string };
  departure_city?: string;
  departure_time?: string;
  arrival_time?: string;
  check_in_date?: string;
  check_out_date?: string;
  passenger_name?: string;
  summary?: string;
};

type TripData = {
  _id: string;
  shareId?: string;
  itinerary?: ItineraryData;
  extractedText?: string;
};

const n = (v: string | null | undefined) =>
  !v || v === "Not detected" ? null : v;

const DetailModal = ({
  trip,
  onClose,
}: {
  trip: TripData;
  onClose: () => void;
}) => {
  const it = trip.itinerary || {};
  const [showRaw, setShowRaw] = useState(false);

  const dest = n(it.destination) || n(it.destination_city) || "Unknown";
  const flightNum = n(it.flights?.[0]?.flightNumber) || n(it.flight_number);
  const airline = n(it.flights?.[0]?.airline) || n(it.airline);
  const hotelName = n(it.hotels?.[0]?.hotelName) || n(it.hotel_name);
  const startDate = n(it.travelDates?.startDate) || n(it.departure_date);
  const summary = n(it.summary) || `From ${n(it.departure_city) || "?"} to ${dest} on ${startDate || "?"}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mt-10 mb-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-gray-900 to-gray-700 text-white px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 uppercase tracking-wider">Trip Overview</p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">{dest}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition text-white text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-5">
          {summary && (
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📋</span>
                <h3 className="font-semibold text-gray-800">Summary</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{summary}</p>
            </div>
          )}

          {(flightNum || airline || it.departure_city || it.departure_time) && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✈️</span>
                <h3 className="font-semibold text-gray-800">Flight Details</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(airline || flightNum) && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Flight</p>
                    <p className="font-medium text-gray-800">{airline && `${airline} `}{flightNum || "—"}</p>
                  </div>
                )}
                {it.departure_city && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">From</p>
                    <p className="font-medium text-gray-800">{it.departure_city}</p>
                  </div>
                )}
                {(it.destination_city || dest) && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">To</p>
                    <p className="font-medium text-gray-800">{it.destination_city || dest}</p>
                  </div>
                )}
                {it.departure_date && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                    <p className="font-medium text-gray-800">{it.departure_date}</p>
                  </div>
                )}
              </div>
              {(it.departure_time || it.arrival_time) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-400">Depart </span>
                    <span className="font-medium">{it.departure_time || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Arrive </span>
                    <span className="font-medium">{it.arrival_time || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {(hotelName || it.check_in_date || it.check_out_date) && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🏨</span>
                <h3 className="font-semibold text-gray-800">Hotel</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hotelName && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                    <p className="font-medium text-gray-800">{hotelName}</p>
                  </div>
                )}
                {it.check_in_date && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Check-in</p>
                    <p className="font-medium text-gray-800">{it.check_in_date}</p>
                  </div>
                )}
                {it.check_out_date && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Check-out</p>
                    <p className="font-medium text-gray-800">{it.check_out_date}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {it.passenger_name && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👤</span>
                <h3 className="font-semibold text-gray-800">Passenger</h3>
              </div>
              <p className="font-medium text-gray-800">{it.passenger_name}</p>
            </div>
          )}

          {trip.extractedText && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <span className="font-medium text-gray-700">Raw OCR Text</span>
                </div>
                <span className={`text-gray-400 transition-transform ${showRaw ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {showRaw && (
                <div className="px-5 pb-4">
                  <pre className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap font-sans bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                    {trip.extractedText}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { trips, isLoading, error, fetchTrips, deleteTrip } =
    useTripStore();
  const logout = useAuthStore((s) => s.logout);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [, startTransition] = useTransition();
  const [optimisticTrips, setOptimisticTrips] = useOptimistic(trips);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetchTrips();
  }, [fetchTrips]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Delete this trip?")) return;
    startTransition(async () => {
      setOptimisticTrips((prev) => prev.filter((t: TripData) => t._id !== id));
      await deleteTrip(id);
    });
  }, [deleteTrip, setOptimisticTrips]);

  const handleShare = useCallback((shareId: string) => {
    navigator.clipboard.writeText(
      `http://localhost:5173/share/${shareId}`
    );
    alert("Share link copied");
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-300 rounded-lg animate-pulse" />
            <div className="h-9 w-20 bg-gray-300 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-11 w-40 bg-gray-300 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-lg">
              <div className="h-7 w-24 bg-gray-300 rounded animate-pulse mb-3" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4" />
              <div className="h-10 w-full bg-gray-300 rounded animate-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My Trips
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={fetchTrips}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm flex-1 sm:flex-none"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex-1 sm:flex-none"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <a
        href="/upload"
        className="bg-black hover:bg-gray-800 transition text-white px-5 py-3 rounded-lg inline-block mb-6 w-full sm:w-auto text-center"
      >
        Upload New Trip
      </a>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {optimisticTrips.length === 0 ? (
          <div className="text-gray-500 col-span-full text-center py-20">
            No trips found
          </div>
        ) : (
          optimisticTrips.map((trip: TripData) => (
            <div
              key={trip._id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] sm:hover:scale-105 transition"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                {n(trip.itinerary?.destination) || n(trip.itinerary?.destination_city) || "Unknown"}
              </h2>

              <p className="mb-1 text-sm sm:text-base">
                ✈️ Flight:{" "}
                {n(trip.itinerary?.flights?.[0]?.flightNumber) || n(trip.itinerary?.flight_number) || "N/A"}
              </p>

              <p className="mb-1 text-sm sm:text-base">
                🏨 Hotel:{" "}
                {n(trip.itinerary?.hotels?.[0]?.hotelName) || n(trip.itinerary?.hotel_name) || "N/A"}
              </p>

              <p className="mb-1 text-sm sm:text-base">
                📅 Start:{" "}
                {n(trip.itinerary?.travelDates?.startDate) || n(trip.itinerary?.departure_date) || "N/A"}
              </p>

              <p className="text-gray-600 text-sm mt-3 font-medium">📋 Summary</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {n(trip.itinerary?.summary) || `From ${n(trip.itinerary?.departure_city) || "?"} to ${n(trip.itinerary?.destination_city || trip.itinerary?.destination) || "?"} on ${n(trip.itinerary?.departure_date) || "?"}`}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="bg-gray-800 hover:bg-black transition text-white px-4 py-2 rounded flex-1 text-sm"
                >
                  View Details
                </button>
                {trip.shareId && (
                  <button
                    onClick={() => handleShare(trip.shareId!)}
                    className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded flex-1 text-sm"
                  >
                    Share
                  </button>
                )}
                <button
                  onClick={() => handleDelete(trip._id)}
                  className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded flex-1 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTrip && (
        <DetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

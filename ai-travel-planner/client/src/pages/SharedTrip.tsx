import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type SharedItinerary = {
  destination?: string;
  destination_city?: string;
  flight_number?: string;
  flights?: { flightNumber?: string; airline?: string; from?: string; to?: string; departureDate?: string; departureTime?: string; arrivalTime?: string }[];
  airline?: string;
  hotel_name?: string;
  hotels?: { hotelName?: string; checkInDate?: string; checkOutDate?: string }[];
  departure_date?: string;
  departure_city?: string;
  departure_time?: string;
  arrival_time?: string;
  check_in_date?: string;
  check_out_date?: string;
  passenger_name?: string;
  summary?: string;
};

type SharedTripData = {
  itinerary?: SharedItinerary;
};

const SharedTrip = () => {
  const { shareId } = useParams();
  const [trip, setTrip] = useState<SharedTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrip = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/share/${shareId}`
      );
      setTrip(res.data);
    } catch (err: unknown) {
      const msg =
        err instanceof Object && "response" in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message
          : "Failed to load trip";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );

  if (!trip) return null;

  const it = trip.itinerary || {};
  const dest = it.destination || it.destination_city || "Trip";
  const flightNum = it.flights?.[0]?.flightNumber || it.flight_number;
  const airline = it.flights?.[0]?.airline || it.airline;
  const departureCity = it.flights?.[0]?.from || it.departure_city;
  const destinationCity = it.flights?.[0]?.to || it.destination_city;
  const departureDate = it.flights?.[0]?.departureDate || it.departure_date;
  const departureTime = it.flights?.[0]?.departureTime || it.departure_time;
  const arrivalTime = it.flights?.[0]?.arrivalTime || it.arrival_time;
  const hotelName = it.hotels?.[0]?.hotelName || it.hotel_name;
  const checkIn = it.hotels?.[0]?.checkInDate || it.check_in_date;
  const checkOut = it.hotels?.[0]?.checkOutDate || it.check_out_date;
  const passengerName = it.passenger_name;

  return (
    <div className="min-h-screen p-4 sm:p-10 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-linear-to-r from-gray-900 to-gray-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wider">Shared Trip</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">{dest}</h1>
          {it.summary && (
            <p className="text-gray-200 mt-3 text-base sm:text-lg leading-relaxed">
              {it.summary}
            </p>
          )}
        </div>

        {(flightNum || airline || departureCity || destinationCity || departureTime || arrivalTime) && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span>✈️</span> Flight Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(airline || flightNum) && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Flight</p>
                  <p className="font-medium text-gray-800">{airline && `${airline} `}{flightNum || "—"}</p>
                </div>
              )}
              {departureCity && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">From</p>
                  <p className="font-medium text-gray-800">{departureCity}</p>
                </div>
              )}
              {destinationCity && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">To</p>
                  <p className="font-medium text-gray-800">{destinationCity}</p>
                </div>
              )}
              {departureDate && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                  <p className="font-medium text-gray-800">{departureDate}</p>
                </div>
              )}
            </div>
            {(departureTime || arrivalTime) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm">
                {departureTime && (
                  <div>
                    <span className="text-gray-400">Depart </span>
                    <span className="font-medium">{departureTime}</span>
                  </div>
                )}
                {arrivalTime && (
                  <div>
                    <span className="text-gray-400">Arrive </span>
                    <span className="font-medium">{arrivalTime}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(hotelName || checkIn || checkOut) && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span>🏨</span> Hotel Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {hotelName && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                  <p className="font-medium text-gray-800">{hotelName}</p>
                </div>
              )}
              {checkIn && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Check-in</p>
                  <p className="font-medium text-gray-800">{checkIn}</p>
                </div>
              )}
              {checkOut && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Check-out</p>
                  <p className="font-medium text-gray-800">{checkOut}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {passengerName && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>👤</span> Passenger
            </h2>
            <p className="font-medium text-gray-800">{passengerName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedTrip;

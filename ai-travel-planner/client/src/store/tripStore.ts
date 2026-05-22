import { create } from "zustand";
import axios from "axios";
import { API_URL } from "../config/api";

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

type TripRecord = {
  _id: string;
  shareId?: string;
  itinerary?: ItineraryData;
  extractedText?: string;
};

type TripState = {
  trips: TripRecord[];
  isLoading: boolean;
  error: string;
  fetchTrips: () => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  uploadFile: (file: File) => Promise<boolean>;
};

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  isLoading: false,
  error: "",

  fetchTrips: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ isLoading: true, error: "" });
    try {
      const res = await axios.get(`${API_URL}/itineraries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ trips: res.data as TripRecord[], isLoading: false });
    } catch (err: unknown) {
      const msg =
        err instanceof Object && "response" in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message
          : "Failed to load trips";
      set({ error: msg, isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { fetchTrips } = get();
      fetchTrips();
    } catch (err: unknown) {
      const msg =
        err instanceof Object && "response" in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message
          : "Failed to delete";
      set({ error: msg });
    }
  },

  uploadFile: async (file) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    set({ isLoading: true, error: "" });
    try {
      const formData = new FormData();
      formData.append("document", file);

      await axios.post(`${API_URL}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ isLoading: false });
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Object && "response" in err
          ? (err as { response: { data: { message: string } } }).response?.data?.message
          : "Upload failed";
      set({ error: msg, isLoading: false });
      return false;
    }
  },
}));

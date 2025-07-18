import { useCallback, useEffect, useState } from "react";
import { RawAppointment } from "@/types/appointment";

export function useAppointments() {
  const [appointments, setAppointments] = useState<RawAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchAppointments = async (cursor?: string) => {
    setLoading(true);

    let query = `?limit=10&sortBy=endAt&sortOrder=asc`;
    if (cursor) query += `&cursor=${encodeURIComponent(cursor)}`;

    const res = await fetch(`/api/doctor/appointments${query}`);
    const json = await res.json();
    console.log("✅ API response:", json);
    console.log("cursor", json.data.nextCursor);

    if (json?.data?.appointments) {
      setAppointments((prev) => [...prev, ...json.data.appointments]);
      setNextCursor(json.data.nextCursor);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchMore = useCallback(() => {
    if (nextCursor) {
      fetchAppointments(nextCursor);
    }
  }, [nextCursor]);

  return {
    appointments,
    loading,
    nextCursor,
    fetchMore,
  };
}

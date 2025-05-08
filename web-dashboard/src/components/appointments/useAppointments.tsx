import { useEffect, useState } from "react";
import { RawAppointment } from "@/types/appointment";

export function useAppointments() {
  const [appointments, setAppointments] = useState<RawAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchAppointments = async (cursor?: string) => {
    setLoading(true);

    const url = new URL("/api/doctor/appointments", window.location.origin);
    url.searchParams.set("limit", "10");
    url.searchParams.set("sortBy", "endAt");
    url.searchParams.set("sortOrder", "asc");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString());
    const json = await res.json();
    console.log("✅ API response:", json); 
    console.log("cursor",json.data.nextCursor);

    if (json?.data?.appointments) {
      setAppointments((prev) => [...prev, ...json.data.appointments]);
      setNextCursor(json.data.nextCursor);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    nextCursor,
    fetchMore: () => {
      if (nextCursor) {
        fetchAppointments(nextCursor);
      }
    },
  };
}

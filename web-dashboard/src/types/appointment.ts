export interface RawAppointment {
  id: string;
  patient: {
    id: string;
    nickname: string;
    avatarUrl?: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  startAt: string;
  endAt: string;
  remark: string;
  status: "normal" | "to_be_rescheduled" | "cancelled";
  createdAt: string;
}

export interface RawAppointment {
  id: string;
  patient: {
    nickname: string;
    gender: "Male" | "Female" | string;
    email?: string;
  };
  doctor: any;
  startAt: string;
  endAt: string;
  remark: string;
  status: "normal" | "to_be_rescheduled" | "cancelled";
  createdAt: string;
}

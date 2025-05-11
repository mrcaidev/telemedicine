export interface ClinicAdmin {
  id: string;
  role: "clinic_admin";
  email: string;
  firstName: string;
  lastName: string;
  clinic: {
    id: string;
    name: string;
  };
}

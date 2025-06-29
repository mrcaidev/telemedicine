"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Doctor } from "@/types/doctor";
import { DoctorFormDialog } from "@/components/dialog/doctor-form-dialog";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/search/search-bar";

export default function ClinicDoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const id = session?.user?.clinicId;
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const refreshDoctors = () => {
    setDoctors([]);
    setCursor(null);
    setHasMore(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchDoctors = async (loadMore = false) => {
    if (loading || (!hasMore && loadMore)) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        clinicId: id || "",
        limit: "10",
        sortBy: "createdAt",
        sortOrder: "asc",
      });

      if (cursor && loadMore) queryParams.append("cursor", cursor);

      const res = await fetch(`/api/clinic/doctor?${queryParams.toString()}`);
      const data = await res.json();
      const newDoctors: Doctor[] = data.data.doctors;

      if (loadMore) {
        setDoctors((prev) => [...prev, ...newDoctors]);
      } else {
        setDoctors(newDoctors);
      }

      if (newDoctors.length < 10) setHasMore(false);
      if (newDoctors.length > 0) {
        setCursor(newDoctors[newDoctors.length - 1].createdAt); // 默认用 createdAt 为 cursor
      }
    } catch {
      toast.error("Loading doctors failed", {
        description: "Can't load doctors, please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDoctors(false);
  }, [refreshTrigger, id]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loading
      ) {
        fetchDoctors(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [cursor, hasMore, loading]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clinic/doctor/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setDoctors((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted successfully", {
        description: "Doctor has been deleted successfully.",
      });
    } catch {
      toast.error("Delete failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h1 className="text-xl font-semibold">Doctor Management</h1>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by doctor name or email"
          />
          <DoctorFormDialog onSuccess={refreshDoctors}>
            <Button className="gap-2 cursor-pointer whitespace-nowrap">
              <Plus size={16} /> Add Doctor
            </Button>
          </DoctorFormDialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDoctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/clinic/doctors/${doctor.id}`)
                }
              >
                <Avatar className="h-8 w-8">
                  <Image
                    src={doctor.avatarURL || "/p.png"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    width={32}
                    height={32}
                  />
                </Avatar>
              </TableCell>
              <TableCell
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/clinic/doctors/${doctor.id}`)
                }
              >
                {`${doctor.firstName} ${doctor.lastName}`}
              </TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.gender}</TableCell>
              <TableCell>{doctor.specialties.join(", ")}</TableCell>
              <TableCell className="text-right space-x-2">
                <DoctorFormDialog
                  defaultValues={doctor}
                  onSuccess={refreshDoctors}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </DoctorFormDialog>
                <ConfirmDialog
                  onConfirm={() => handleDelete(doctor.id)}
                  title="Confirm Deletion"
                  description={`Are you sure you want to delete "${doctor.firstName} ${doctor.lastName}"? This action cannot be undone.`}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </ConfirmDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 加载提示 */}
      {loading && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          Loading...
        </p>
      )}
      {!hasMore && doctors.length > 0 && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          No more doctors to load.
        </p>
      )}
      {!loading && filteredDoctors.length === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-4">
          No doctors found.
        </p>
      )}
    </div>
  );
}
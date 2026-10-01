import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Pasien | Klinik",
  description: "Formulir pendaftaran pasien baru ke sistem antrean klinik.",
};

export default function RegisterPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pasien Baru</h1>
        <p className="text-slate-400 text-sm mt-1">
          Isi formulir di bawah untuk mendaftarkan pasien ke antrean
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nama_pasien: "", nik: "", nomor_hp: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await registerPatient(form);
      setSuccess(res.nomor_antrean);
      setForm({ nama_pasien: "", nik: "", nomor_hp: "" });
      setTimeout(() => router.push("/queue"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
    type?: string;
    pattern?: string;
  }[] = [
    {
      key: "nama_pasien",
      label: "Nama Lengkap",
      placeholder: "Masukkan nama lengkap pasien",
    },
    {
      key: "nik",
      label: "NIK",
      placeholder: "16 digit NIK",
      pattern: "[0-9]{16}",
    },
    {
      key: "nomor_hp",
      label: "Nomor HP",
      placeholder: "Contoh: 08123456789",
      type: "tel",
    },
  ];

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <UserPlus size={20} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Data Pasien
          </h2>
        </div>

        {success && (
          <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-800 font-semibold text-sm">
                Pasien berhasil didaftarkan!
              </p>
              <p className="text-emerald-600 text-xs mt-0.5">
                Nomor antrean: <strong className="text-emerald-700">{success}</strong>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ key, label, placeholder, type = "text", pattern }) => (
            <div key={key}>
              <label
                htmlFor={key}
                className="block text-xs font-medium text-slate-600 mb-1.5"
              >
                {label}
              </label>
              <input
                id={key}
                type={type}
                pattern={pattern}
                required
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            id="btn-register-patient"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-100 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Mendaftarkan...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Daftarkan Pasien
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

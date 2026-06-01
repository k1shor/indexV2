"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  Loader2,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  downloadDatabaseBackup,
  previewDatabaseRestore,
  restoreDatabaseBackup,
} from "@/pages/api/databaseAPI";

export default function DatabaseAdminPage() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const collectionRows = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary).sort(([left], [right]) => left.localeCompare(right));
  }, [summary]);

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const handleDownload = async () => {
    clearStatus();
    setIsDownloading(true);

    try {
      const { blob, filename } = await downloadDatabaseBackup();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded successfully.");
    } catch (err) {
      setError(err.message || "Backup download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setSummary(null);
    clearStatus();
  };

  const handleValidate = async () => {
    if (!selectedFile) {
      setError("Choose a backup file first.");
      return;
    }

    clearStatus();
    setIsValidating(true);

    try {
      const data = await previewDatabaseRestore(selectedFile);
      setSummary(data.summary || null);
      setMessage("Backup file is valid.");
    } catch (err) {
      setError(err.message || "Backup validation failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setError("Choose a backup file first.");
      return;
    }

    const confirmed = window.confirm(
      "Restore will replace matching database collections with this backup. Continue?"
    );

    if (!confirmed) return;

    clearStatus();
    setIsRestoring(true);

    try {
      const data = await restoreDatabaseBackup(selectedFile);
      setSummary(data.restoredCollections || null);
      setMessage("Database restored successfully.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "Database restore failed.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Database className="h-6 w-6 text-brand-light dark:text-blue-400" />
            Database Backup
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Export or restore the production content database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-4 py-2 font-medium text-slate-950 transition hover:bg-[#4F96EE] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
        >
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isDownloading ? "Preparing" : "Download Backup"}
        </button>
      </div>

      {(message || error) && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
          }`}
        >
          {error ? <AlertTriangle className="mt-0.5 h-4 w-4" /> : <CheckCircle2 className="mt-0.5 h-4 w-4" />}
          <span>{error || message}</span>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Upload className="h-5 w-5 text-brand-light dark:text-blue-400" />
            Restore Backup
          </div>

          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center transition hover:border-brand-light dark:border-gray-600 dark:hover:border-blue-400">
            <FileJson className="h-8 w-8 text-gray-500 dark:text-gray-300" />
            <span className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Choose JSON backup"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleValidate}
              disabled={!selectedFile || isValidating || isRestoring}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Validate File
            </button>

            <button
              type="button"
              onClick={handleRestore}
              disabled={!selectedFile || isRestoring || isValidating}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              Restore Database
            </button>
          </div>

          <div className="flex items-start gap-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <span>Restore replaces matching collection data.</span>
          </div>
        </section>

        <aside className="border-l border-gray-200 pl-0 dark:border-gray-700 lg:pl-6">
          <h2 className="text-lg font-semibold">Collection Summary</h2>

          {collectionRows.length ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full table-fixed text-left text-sm">
                <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Collection</th>
                    <th className="w-24 px-4 py-3 text-right font-semibold">Docs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {collectionRows.map(([name, count]) => (
                    <tr key={name}>
                      <td className="truncate px-4 py-3" title={name}>{name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">No backup file validated yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

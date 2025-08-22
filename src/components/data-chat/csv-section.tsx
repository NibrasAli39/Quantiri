"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MotionCard from "../ui/motion-card";
import PreviewTable from "./preview-table";
import { useParseCsvMutation } from "@/lib/hooks/ai";
import { useAIAssistantStore } from "@/lib/stores/ai-assistant";

export default function CSVSection() {
  const parseCsv = useParseCsvMutation();
  const { dataset, setDataset, setStatus, clearDataset } =
    useAIAssistantStore();

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error("Please upload a .csv file");
        return;
      }

      setStatus("parsing");
      try {
        const res = await parseCsv.mutateAsync(file);
        setDataset(res);
        toast.success(`Loaded ${res.rowCount} rows`);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Failed to parse CSV");
        }
        setDataset(null);
      }
    },
    [parseCsv, setDataset, setStatus],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    noClick: true,
  });

  return (
    <MotionCard
      className="bg-white rounded-2xl shadow-md p-4"
      id="dataset-section"
    >
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="text-sm font-semibold">Dataset</h3>
        {dataset ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearDataset}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        ) : null}
      </div>

      {!dataset ? (
        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-xl p-6 grid place-content-center text-center cursor-pointer transition ${
            isDragActive ? "border-slate-900 bg-slate-50" : "border-slate-200"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-8 w-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop CSV here
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={open}>
              Browse files
            </Button>
            <Button
              size="sm"
              onClick={() => {
                useAIAssistantStore.getState().loadSampleDataset();
                toast.success("Sample dataset loaded");
              }}
            >
              Load sample
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="font-medium">{dataset.fileName}</span>
            <span className="mx-1">•</span>
            <span>{(dataset.fileSize / 1024).toFixed(1)} KB</span>
            <span className="mx-1">•</span>
            <span>{dataset.rowCount} rows</span>
          </div>

          <PreviewTable columns={dataset.columns} rows={dataset.rows} />
        </div>
      )}
    </MotionCard>
  );
}

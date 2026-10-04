import { RefreshCw } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center">
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
        <RefreshCw className="h-6 w-6 text-[#FF5500] animate-spin" />
        <span className="text-sm font-semibold text-slate-700">Loading DownCloudMe...</span>
      </div>
    </div>
  );
}

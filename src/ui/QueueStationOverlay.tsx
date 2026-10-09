import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export interface HeavyJob {
  id: string;
  name: string;
  payloadSize: string;
  workerTime: string;
}

const JOBS: HeavyJob[] = [
  { id: 'job_1', name: 'Encode 4K Video Stream', payloadSize: '2.4 GB', workerTime: '45s in background' },
  { id: 'job_2', name: 'Render 10,000 PDF Tax Invoices', payloadSize: '45 MB', workerTime: '12s in background' },
  { id: 'job_3', name: 'Blast 50,000 Push Notifications', payloadSize: '8 MB', workerTime: '6s in background' },
  { id: 'job_4', name: 'Batch AI Upscale (200 Photos)', payloadSize: '850 MB', workerTime: '20s in background' },
];

interface QueueStationOverlayProps {
  onComplete: () => void;
}

export const QueueStationOverlay: React.FC<QueueStationOverlayProps> = ({
  onComplete,
}) => {
  const [enqueuedJobs, setEnqueuedJobs] = useState<string[]>([]);
  const [activeWorkerJobs, setActiveWorkerJobs] = useState<string[]>([]);
  const [completedJobs, setCompletedJobs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerJobEnqueue = (jobId: string) => {
    sounds.playGateBeep();
    setEnqueuedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));

    // Simulate immediate HTTP 202 Accepted, then background worker picks up
    setTimeout(() => {
      setActiveWorkerJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      sounds.playRise();
    }, 600);

    setTimeout(() => {
      setActiveWorkerJobs((prev) => prev.filter((id) => id !== jobId));
      setCompletedJobs((prev) => {
        const next = prev.includes(jobId) ? prev : [...prev, jobId];
        if (next.length >= JOBS.length) {
          setTimeout(() => {
            sounds.playSuccess();
            onComplete();
          }, 800);
        }
        return next;
      });
      sounds.playCorrectDing();
    }, 2000);
  };

  const handleEnqueue = (jobId: string) => {
    if (enqueuedJobs.includes(jobId) || isProcessing) return;
    sounds.playClick();
    triggerJobEnqueue(jobId);
  };

  const handleEnqueueAll = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    sounds.playRise();

    JOBS.forEach((job, idx) => {
      setTimeout(() => {
        triggerJobEnqueue(job.id);
      }, idx * 350);
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Message Queue Buffer (RabbitMQ / Kafka)
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-cyan-400 font-bold">Web Server: 202 Accepted (2ms)</span>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-2 mb-4">
          {JOBS.map((job) => {
            const isQueued = enqueuedJobs.includes(job.id);
            const isWorking = activeWorkerJobs.includes(job.id);
            const isDone = completedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isWorking
                        ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                        : isQueued
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-white block">{job.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Payload: {job.payloadSize} • {job.workerTime}
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                    Completed
                  </span>
                ) : isWorking ? (
                  <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-bold text-[10px] animate-pulse">
                    Worker Running
                  </span>
                ) : isQueued ? (
                  <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px]">
                    Buffered in Queue
                  </span>
                ) : (
                  <button
                    onClick={() => handleEnqueue(job.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95"
                  >
                    Enqueue
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Bulk Enqueue Action */}
        <button
          onClick={handleEnqueueAll}
          disabled={isProcessing || completedJobs.length === JOBS.length}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30 active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>
            {completedJobs.length === JOBS.length
              ? 'All Heavy Tasks Handled Successfully!'
              : 'Enqueue All Tasks & Dispatch Worker Fleet'}
          </span>
        </button>
      </motion.div>
    </div>
  );
};

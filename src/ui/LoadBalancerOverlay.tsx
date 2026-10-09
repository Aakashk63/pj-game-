import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Server, ArrowRight, RefreshCw, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { sounds } from '../engine/soundManager';

interface LoadBalancerOverlayProps {
  onComplete: () => void;
}

export const LoadBalancerOverlay: React.FC<LoadBalancerOverlayProps> = ({ onComplete }) => {
  const [algorithm, setAlgorithm] = useState<'round_robin' | 'least_conn' | 'ip_hash'>('round_robin');
  const [server1Healthy, setServer1Healthy] = useState(true);
  const [server2Healthy, setServer2Healthy] = useState(true);
  const [office1Count, setOffice1Count] = useState(5);
  const [office2Count, setOffice2Count] = useState(5);
  const [lastRoutedTo, setLastRoutedTo] = useState<'office1' | 'office2'>('office1');
  const [dispatchAnimActive, setDispatchAnimActive] = useState(false);

  // Dispatch a test batch of 4 requests
  const handleDispatchBatch = () => {
    sounds.playClick();
    setDispatchAnimActive(true);

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      if (!server1Healthy) {
        setOffice2Count((prev) => prev + 1);
        setLastRoutedTo('office2');
      } else if (!server2Healthy) {
        setOffice1Count((prev) => prev + 1);
        setLastRoutedTo('office1');
      } else {
        // Alternate
        if (counter % 2 === 1) {
          setOffice1Count((prev) => prev + 1);
          setLastRoutedTo('office1');
        } else {
          setOffice2Count((prev) => prev + 1);
          setLastRoutedTo('office2');
        }
      }

      if (counter >= 4) {
        clearInterval(interval);
        setDispatchAnimActive(false);
      }
    }, 280);
  };

  const toggleServer1Health = () => {
    sounds.playClick();
    setServer1Healthy(!server1Healthy);
  };

  const toggleServer2Health = () => {
    sounds.playClick();
    setServer2Healthy(!server2Healthy);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              The Traffic Director Station
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Load Balancer
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure algorithms & verify automatic traffic distribution
            </p>
          </div>
        </div>

        {/* Algorithm Picker */}
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Select Balancing Algorithm:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'round_robin', label: 'Round Robin', desc: 'Alternates 1:1 in sequence' },
              { id: 'least_conn', label: 'Least Connections', desc: 'Routes to least busy node' },
              { id: 'ip_hash', label: 'IP Hash', desc: 'Sticky client-to-server mapping' },
            ].map((alg) => (
              <button
                key={alg.id}
                onClick={() => {
                  sounds.playClick();
                  setAlgorithm(alg.id as any);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  algorithm === alg.id
                    ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400/50 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-cyan-300">{alg.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{alg.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Live Balancing Topology */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-semibold">
            <span>Incoming Clients</span>
            <span>Reverse Proxy</span>
            <span>Backend Server Pool</span>
          </div>

          <div className="flex items-center justify-between gap-3 relative py-2">
            {/* Clients Source */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[11px] text-slate-300 font-bold mt-1.5">Traffic Flow</span>
            </div>

            {/* Inbound Arrow */}
            <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

            {/* Load Balancer Center Node */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Network className="w-7 h-7 animate-pulse" />
              </div>
              <span className="text-[11px] text-cyan-300 font-bold mt-1.5">Load Balancer</span>
            </div>

            {/* Outbound Split Arrows */}
            <div className="flex flex-col gap-5 text-slate-600">
              <ArrowRight className={`w-4 h-4 transition-colors ${lastRoutedTo === 'office1' ? 'text-emerald-400' : 'text-slate-600'}`} />
              <ArrowRight className={`w-4 h-4 transition-colors ${lastRoutedTo === 'office2' ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>

            {/* Two Backend Offices */}
            <div className="flex flex-col gap-3">
              {/* Office 1 */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 min-w-[170px] ${
                server1Healthy ? 'bg-slate-900 border-slate-700' : 'bg-rose-950/40 border-rose-500/60'
              }`}>
                <div className="flex items-center gap-2">
                  <Server className={`w-4 h-4 ${server1Healthy ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">Office 1</div>
                    <div className="text-[10px] text-slate-400">{office1Count} Active Visitors</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  server1Healthy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {server1Healthy ? '200 OK' : 'CRASHED'}
                </span>
              </div>

              {/* Office 2 */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 min-w-[170px] ${
                server2Healthy ? 'bg-slate-900 border-slate-700' : 'bg-rose-950/40 border-rose-500/60'
              }`}>
                <div className="flex items-center gap-2">
                  <Server className={`w-4 h-4 ${server2Healthy ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-white">Office 2</div>
                    <div className="text-[10px] text-slate-400">{office2Count} Active Visitors</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  server2Healthy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {server2Healthy ? '200 OK' : 'CRASHED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Actions */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={handleDispatchBatch}
            disabled={dispatchAnimActive}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dispatchAnimActive ? 'animate-spin' : ''}`} />
            <span>Send 4 Visitors</span>
          </button>

          <button
            onClick={toggleServer1Health}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              server1Healthy
                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-600/40'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-600/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{server1Healthy ? 'Crash Office 1' : 'Restore Office 1'}</span>
          </button>

          <button
            onClick={toggleServer2Health}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
              server2Healthy
                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-600/40'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-600/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{server2Healthy ? 'Crash Office 2' : 'Restore Office 2'}</span>
          </button>
        </div>

        {/* Bottom Confirmation Action */}
        <button
          onClick={() => {
            sounds.playSuccess();
            onComplete();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Deploy Load Balancer To Campus (50/50 Split)</span>
        </button>
      </motion.div>
    </div>
  );
};

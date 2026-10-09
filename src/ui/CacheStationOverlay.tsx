import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, HardDrive, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { sounds } from '../engine/soundManager';

export interface CacheQuery {
  id: string;
  endpoint: string;
  description: string;
  isCached: boolean;
  ramLatency: string;
  diskLatency: string;
}

const QUERIES: CacheQuery[] = [
  {
    id: 'q1',
    endpoint: 'GET /products/macbook_m3',
    description: 'First request for featured product',
    isCached: false,
    ramLatency: '1.2ms',
    diskLatency: '94ms',
  },
  {
    id: 'q2',
    endpoint: 'GET /products/macbook_m3',
    description: 'Second visitor requests identical product',
    isCached: true,
    ramLatency: '0.8ms',
    diskLatency: '92ms',
  },
  {
    id: 'q3',
    endpoint: 'GET /home/trending_deals',
    description: 'Viral campaign hot homepage banner',
    isCached: true,
    ramLatency: '1.1ms',
    diskLatency: '110ms',
  },
  {
    id: 'q4',
    endpoint: 'GET /user/profile/8841',
    description: 'Fresh user login profile load',
    isCached: false,
    ramLatency: '1.4ms',
    diskLatency: '88ms',
  },
];

interface CacheStationOverlayProps {
  onComplete: () => void;
}

export const CacheStationOverlay: React.FC<CacheStationOverlayProps> = ({
  onComplete,
}) => {
  const [queryIndex, setQueryIndex] = useState(0);
  const [cachedKeys, setCachedKeys] = useState<string[]>(['GET /home/trending_deals']);
  const [status, setStatus] = useState<'idle' | 'checking' | 'hit' | 'miss'>('idle');
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  const currentQ = QUERIES[queryIndex];
  const isDone = queryIndex >= QUERIES.length;

  const handleLookup = () => {
    if (status !== 'idle') return;
    sounds.playScan();
    setStatus('checking');

    const isHit = cachedKeys.includes(currentQ.endpoint);

    setTimeout(() => {
      if (isHit) {
        sounds.playCorrectDing();
        setStatus('hit');
        setHits((h) => h + 1);
      } else {
        sounds.playDenyBuzz();
        setStatus('miss');
        setMisses((m) => m + 1);
        // Write to cache
        setCachedKeys((prev) => [...prev, currentQ.endpoint]);
      }
    }, 800);

    setTimeout(() => {
      advance();
    }, 2200);
  };

  const advance = () => {
    setStatus('idle');
    const nextIdx = queryIndex + 1;
    if (nextIdx >= QUERIES.length) {
      sounds.playSuccess();
      onComplete();
    } else {
      setQueryIndex(nextIdx);
    }
  };

  if (isDone) return null;

  const totalQueries = hits + misses;
  const hitRatio = totalQueries > 0 ? Math.round((hits / totalQueries) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
              {queryIndex + 1}
            </span>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" />
              Redis Cache-Aside Station ({queryIndex + 1} of {QUERIES.length})
            </h4>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold">Hit Ratio: {hitRatio}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400">Hits: {hits}</span>
            <span className="text-amber-400">Miss: {misses}</span>
          </div>
        </div>

        {/* Incoming Query Terminal */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Incoming Request
            </span>
            <span className="text-xs text-slate-400">{currentQ.description}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 font-mono text-sm text-sky-300 font-bold border border-slate-800 flex items-center justify-between">
            <span>{currentQ.endpoint}</span>
            <span className="text-xs text-slate-500 font-normal">HTTP/2</span>
          </div>

          {/* Inspection Outcome Visual */}
          <AnimatePresence>
            {status === 'checking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-sky-400"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Querying Redis In-Memory Hash Table...</span>
              </motion.div>
            )}

            {status === 'hit' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-black text-emerald-400 block">CACHE HIT (RAM)</span>
                    <span>Served directly from memory! Zero disk I/O.</span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-emerald-300">
                  ⚡ {currentQ.ramLatency}
                </div>
              </motion.div>
            )}

            {status === 'miss' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-black text-amber-400 block">CACHE MISS (DISK SQL)</span>
                    <span>Queried database on disk. Key stored in Redis for next time!</span>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-amber-300">
                  ⏳ {currentQ.diskLatency}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLookup}
          disabled={status !== 'idle'}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/30 active:scale-95"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{status === 'idle' ? 'Check Fast-Lane Memory Cache' : 'Processing Query...'}</span>
        </button>
      </motion.div>
    </div>
  );
};

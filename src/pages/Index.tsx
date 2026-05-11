import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Signal, Wifi, WifiOff, Battery } from "lucide-react";
import { FeedScreen } from "@/components/forum/FeedScreen";
import { DetailScreen } from "@/components/forum/DetailScreen";
import { CreateScreen } from "@/components/forum/CreateScreen";
import { RoadHistoryScreen } from "@/components/forum/RoadHistoryScreen";
import { GuidelinesSheet } from "@/components/forum/GuidelinesSheet";
import { ThreadDetailScreen } from "@/components/forum/ThreadDetailScreen";
import { EmptyStateScreen, type EmptyStateVariant } from "@/components/forum/EmptyStateScreen";
import { DemoLinksMenu } from "@/components/DemoLinksMenu";

export type ScreenState =
  | { type: 'feed' }
  | { type: 'detail'; postId: string }
  | { type: 'create' }
  | { type: 'guidelines' }
  | { type: 'thread-view' }
  | { type: 'thread-input' }
  | { type: 'thread-limit' }
  | { type: 'empty'; variant: EmptyStateVariant }
  | { type: 'history'; road: string };

const Index = () => {
  const [screen, setScreen] = useState<ScreenState>({ type: 'feed' });
  const [history, setHistory] = useState<ScreenState[]>([]);
  const [direction, setDirection] = useState(1);
  const [isOffline, setIsOffline] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'error' | 'progress' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'info' | 'error' | 'progress' = 'info') => {
    setToast({ message, type });
    if (type !== 'progress') {
      setTimeout(() => setToast(prev => (prev?.message === message ? null : prev)), 2000);
    }
  }, []);

  // Simulate sync when going back online
  const handleToggleOffline = useCallback(() => {
    if (isOffline) {
      // Going online - simulate sync
      setIsOffline(false);
      setIsSyncing(true);
      setSyncProgress(0);
      showToast('✅ Back Online – Syncing...', 'info');

      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSyncing(false);
            setTimeout(() => showToast('✓ 2 posts have been published', 'success'), 500);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    } else {
      setIsOffline(true);
      showToast('📡 You are now offline', 'warning');
    }
  }, [isOffline, showToast]);

  const navigate = useCallback((newScreen: ScreenState) => {
    setDirection(1);
    setHistory(prev => [...prev, screen]);
    setScreen(newScreen);
  }, [screen]);

  const goBack = useCallback(() => {
    const prev = history[history.length - 1];
    if (prev) {
      setDirection(-1);
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
    }
  }, [history]);

  const screenKey = screen.type === 'detail' ? `detail-${screen.postId}` : screen.type;

  const renderScreen = () => {
    switch (screen.type) {
      case 'feed':
        return <FeedScreen onNavigate={navigate} onBack={goBack} isOffline={isOffline} showToast={showToast} />;
      case 'detail':
        return <DetailScreen postId={screen.postId} onNavigate={navigate} onBack={goBack} isOffline={isOffline} showToast={showToast} />;
      case 'create':
        return <CreateScreen onNavigate={navigate} onBack={goBack} isOffline={isOffline} />;
      case 'history':
        return <RoadHistoryScreen road={screen.road} onNavigate={navigate} onBack={goBack} />;
      case 'guidelines':
        return (
          <div className="absolute inset-0">
            <FeedScreen onNavigate={navigate} onBack={goBack} isOffline={isOffline} showToast={showToast} />
            <GuidelinesSheet
              onAgree={() => setScreen({ type: 'create' })}
              onDismiss={() => setScreen({ type: 'feed' })}
            />
          </div>
        );
      case 'thread-view':
        return <ThreadDetailScreen onBack={goBack} onNavigate={navigate} stateLabel="Thread View" initial={{ kind: 'none' }} />;
      case 'thread-input':
        return <ThreadDetailScreen onBack={goBack} onNavigate={navigate} stateLabel="Reply Input Open" initial={{ kind: 'inputOpen', replyId: 'r2' }} />;
      case 'thread-limit':
        return <ThreadDetailScreen onBack={goBack} onNavigate={navigate} stateLabel="Reply Limit Reached" initial={{ kind: 'limitReached', replyId: 'r1a' }} />;
    }
  };

  return (
    <div className="min-h-screen bg-pgn-warm-border/40 flex items-center justify-center md:p-8">
      <DemoLinksMenu
        onSelectState={(s) => {
          setHistory([]);
          setScreen(s);
        }}
        states={[
          { label: 'First Post — Guidelines Sheet', desc: 'Bottom sheet shown to first-time posters', state: { type: 'guidelines' } },
          { label: 'Returning User — Post Form', desc: 'Direct post creation, bypassing guidelines', state: { type: 'create' } },
          { label: 'Post Detail — Thread View', desc: '2-level threaded replies, no input open', state: { type: 'thread-view' } },
          { label: 'Post Detail — Reply Input Open (L1)', desc: 'Inline reply field expanded under a level-1 reply', state: { type: 'thread-input' } },
          { label: 'Post Detail — Reply Limit Reached', desc: 'Inline notice shown when replying to a level-2 reply', state: { type: 'thread-limit' } },
        ]}
      />
      <div className="w-full md:w-[390px] md:h-[844px] md:rounded-[44px] md:shadow-2xl md:border-[10px] md:border-pgn-dark bg-background overflow-hidden relative flex flex-col min-h-screen md:min-h-0">
        {/* Notch */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-pgn-dark rounded-b-[18px] z-50" />

        {/* Status bar */}
        <div className="h-11 flex items-end justify-between px-7 pb-1 text-[11px] font-semibold bg-card flex-shrink-0">
          <span className="text-foreground">9:41</span>
          <div className="flex items-center gap-1.5 text-foreground/60">
            <Signal size={13} />
            {/* Offline toggle */}
            <button
              onClick={handleToggleOffline}
              className={`relative p-0.5 rounded transition-colors ${isOffline ? 'text-destructive' : 'text-foreground/60'}`}
              title="Toggle offline mode"
            >
              {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
            </button>
            <Battery size={13} />
          </div>
        </div>

        {/* Sync progress bar */}
        {isSyncing && (
          <div className="h-1 bg-border flex-shrink-0">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${syncProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screenKey}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.message}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 100 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.y > 40) setToast(null); }}
              onClick={() => setToast(null)}
              className="absolute bottom-20 left-4 right-4 z-[60] cursor-pointer"
              style={{ maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div
                className="rounded-xl px-4 py-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[15px] font-medium text-white flex items-center gap-2.5"
                style={{
                  backgroundColor:
                    toast.type === 'success' ? '#10B981' :
                    toast.type === 'info'    ? '#29ABE2' :
                    toast.type === 'warning' ? '#F59E0B' :
                    toast.type === 'error'   ? '#EF4444' :
                    /* progress */             '#D4854A',
                }}
              >
                <span className="text-xl leading-none flex-shrink-0">
                  {toast.type === 'success' ? '✓' :
                   toast.type === 'info'    ? '✓' :
                   toast.type === 'warning' ? '⚠️' :
                   toast.type === 'error'   ? '✕' :
                                              '⏳'}
                </span>
                <span className="flex-1">{toast.message.replace(/^[✓⚠️✕⏳📡✅📍]+\s*/, '')}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home indicator */}
        <div className="h-8 flex items-center justify-center bg-card flex-shrink-0">
          <div className="w-[134px] h-[5px] bg-foreground/15 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Index;

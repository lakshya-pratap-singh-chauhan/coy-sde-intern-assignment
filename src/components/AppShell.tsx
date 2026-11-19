'use client';

import { useState } from 'react';
import TabBar, { type Tab } from './TabBar';
import HomeTab from './HomeTab';
import DiscoverTab from './DiscoverTab';
import MatchesTab from './MatchesTab';

export default function AppShell() {
  const [tab, setTab] = useState<Tab>('discover');

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-[430px] flex-col overflow-hidden bg-white sm:border-x-[3px] sm:border-coy-ink sm:shadow-2xl">
      <div className="min-h-0 flex-1">
        {tab === 'home' && <HomeTab onDiscover={() => setTab('discover')} />}
        {tab === 'discover' && <DiscoverTab onViewMatches={() => setTab('matches')} />}
        {tab === 'matches' && <MatchesTab />}
      </div>
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

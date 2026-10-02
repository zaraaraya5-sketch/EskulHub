import React, { useState } from 'react';
import { useAuth } from '@/features/authentication/providers/AuthProvider';
import { SchoolEvent } from '@/types';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { GuestNotificationBanner } from '../components/GuestNotificationBanner';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarFilterBar } from '../components/CalendarFilterBar';
import { CalendarGrid } from '../components/CalendarGrid';
import { EventDetailModal } from '../components/EventDetailModal';
import { ImportExcelModal } from '../components/ImportExcelModal';

interface CalendarPageProps {
  onNavigate?: (path: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<SchoolEvent | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const {
    loading,
    selectedCategory,
    setSelectedCategory,
    monthGrid,
    filteredEvents,
    monthYearLabel,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    fetchEvents,
    handleDeleteEvent,
    isDeleting,
    deleteError,
  } = useCalendarEvents(currentUser?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {!currentUser && <GuestNotificationBanner onNavigate={onNavigate} />}

      <div className="bg-white border border-[#EAE6DC] rounded-2xl p-5 shadow-sm space-y-4">
        <CalendarHeader
          monthYearLabel={monthYearLabel}
          role={role}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onNavigate={onNavigate}
        />

        <CalendarFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalEventsCount={filteredEvents.length}
          loading={loading}
        />
      </div>

      <CalendarGrid
        monthGrid={monthGrid}
        events={filteredEvents}
        onSelectEvent={setSelectedEventForDetail}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        currentUser={currentUser}
        role={role}
        onDelete={(id) => handleDeleteEvent(id, selectedEventForDetail)}
        isDeleting={isDeleting}
        deleteError={deleteError}
        onNavigate={onNavigate}
      />

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchEvents}
        currentUser={currentUser}
        role={role || ''}
      />
    </div>
  );
};

import { useState, useCallback, useRef, useEffect } from 'react';
import { TrashState } from './types';

export function useTrashInteraction() {
  const [trashState, setTrashState] = useState<TrashState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (timer2Ref.current) {
      clearTimeout(timer2Ref.current);
      timer2Ref.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => clearTimers, [clearTimers]);

  const desktopVisible = trashState === 'idle' || trashState === 'confirmEmpty';

  const triggerTrash = useCallback(() => {
    if (trashState !== 'idle') return;
    setTrashState('confirmEmpty');
  }, [trashState]);

  const cancelEmpty = useCallback(() => {
    if (trashState !== 'confirmEmpty') return;
    setTrashState('idle');
  }, [trashState]);

  const confirmEmpty = useCallback(() => {
    if (trashState !== 'confirmEmpty') return;
    clearTimers();
    setTrashState('emptying');

    // After animation completes (~1200ms) + 250ms buffer, show delete confirmation
    timerRef.current = setTimeout(() => {
      setTrashState('confirmDelete');
    }, 1450);
  }, [trashState, clearTimers]);

  const restoreFromConfirm = useCallback(() => {
    if (trashState !== 'confirmDelete') return;
    clearTimers();
    setTrashState('restoring');

    timerRef.current = setTimeout(() => {
      setTrashState('idle');
    }, 1200);
  }, [trashState, clearTimers]);

  const confirmDelete = useCallback(() => {
    if (trashState !== 'confirmDelete') return;
    clearTimers();
    setTrashState('deletedTemp');

    // After 5 seconds, begin restoring
    timerRef.current = setTimeout(() => {
      setTrashState('restoring');

      timer2Ref.current = setTimeout(() => {
        setTrashState('idle');
      }, 1200);
    }, 5000);
  }, [trashState, clearTimers]);

  const trashDisabled = trashState === 'emptying' || trashState === 'restoring';

  return {
    trashState,
    desktopVisible,
    trashDisabled,
    triggerTrash,
    cancelEmpty,
    confirmEmpty,
    restoreFromConfirm,
    confirmDelete,
  };
}

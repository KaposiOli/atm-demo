import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notes {
  '20000': number;
  '10000': number;
  '5000': number;
  '2000': number;
}

export interface Transaction {
  amount: number;
  success: boolean;
  time: string;
  notesDispensed: Partial<Notes>;
}

export interface ATMState {
  notes: Notes;
  history: Transaction[];
  error?: string;
  lastDispensedNotes?: Partial<Notes>;
}

const initialState: ATMState = {
  notes: {
    '20000': 10,
    '10000': 10,
    '5000': 10,
    '2000': 10,
  },
  history: [],
};

const atmSlice = createSlice({
  name: 'atm',
  initialState,
  reducers: {
    withdraw(state, action: PayloadAction<number>) {
      const amount = action.payload;
      const { success, updatedNotes, dispensedNotes, errorMessage } = canWithdrawNotes(amount, state.notes);

      if (success) {
        state.notes = updatedNotes;
        state.history.push({
          amount,
          success: true,
          time: new Date().toUTCString(),
          notesDispensed: dispensedNotes,
        });
        state.lastDispensedNotes = dispensedNotes;
        state.error = undefined;
      } else {
        state.history.push({
          amount,
          success: false,
          time: new Date().toUTCString(),
          notesDispensed: {},
        });
        state.error = errorMessage;
        state.lastDispensedNotes = undefined;
      }
    },
    updateNotes(state, action: PayloadAction<Partial<Notes>>) {
      state.notes = { ...state.notes, ...action.payload };
    },
    clearError(state) {
      state.error = undefined;
    },
    resetATM(state) {
      state.notes = initialState.notes;
      state.history = [];
    },
  },
});

export const { withdraw, updateNotes, clearError, resetATM } = atmSlice.actions;
export default atmSlice.reducer;

function canWithdrawNotes(amount: number, availableNotes: Notes) {
  let remainingAmount = amount;
  let dispensedNotes: Partial<Notes> = {};
  const noteTypes = ['20000', '10000', '5000', '2000'];

  for (let note of noteTypes) {
    const noteValue = Number(note);
    const noteCount = Math.min(Math.floor(remainingAmount / noteValue), availableNotes[note as keyof Notes]);
    if (noteCount > 0) {
      dispensedNotes[note as keyof Notes] = noteCount;
      remainingAmount -= noteCount * noteValue;
    }
  }

  const errorMessage = remainingAmount > 0 
    ? 'This amount cannot be dispensed with the available notes.' 
    : undefined;

  const success = remainingAmount === 0;

  return {
    success,
    updatedNotes: success ? updateATMNotes(availableNotes, dispensedNotes) : availableNotes,
    dispensedNotes: success ? dispensedNotes : {},
    errorMessage,
  };
}

function updateATMNotes(availableNotes: Notes, dispensedNotes: Partial<Notes>): Notes {
  const updatedNotes = { ...availableNotes };
  Object.keys(dispensedNotes).forEach(note => {
    const noteValue = note as keyof Notes;
    updatedNotes[noteValue] -= dispensedNotes[noteValue]!;
  });
  return updatedNotes;
}

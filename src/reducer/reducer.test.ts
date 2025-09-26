import { calculatorReducer, initialState } from './reducer';
import { EInputTypes } from '../types';

describe('Calculator Reducer', () => {
  it('should return initial state', () => {
    expect(initialState).toEqual({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false,
    });
  });

  describe('Input Digit', () => {
    it('should handle digit input', () => {
      const state = calculatorReducer(initialState, {
        type: EInputTypes.inputDigit,
        payload: '5',
      });
      expect(state.displayValue).toBe('5');
    });

    it('should append digits', () => {
      const stateWithValue = { ...initialState, displayValue: '12' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.inputDigit,
        payload: '3',
      });
      expect(state.displayValue).toBe('123');
    });

    // NEW: Missing edge cases
    it('should replace display when waiting for operand', () => {
      const stateWaiting = {
        ...initialState,
        displayValue: '5',
        waitingForOperand: true,
      };
      const state = calculatorReducer(stateWaiting, {
        type: EInputTypes.inputDigit,
        payload: '3',
      });
      expect(state.displayValue).toBe('3');
      expect(state.waitingForOperand).toBe(false);
    });

    it('should replace zero with digit', () => {
      const state = calculatorReducer(initialState, {
        type: EInputTypes.inputDigit,
        payload: '7',
      });
      expect(state.displayValue).toBe('7');
    });
  });

  // NEW: Input Dot tests
  describe('Input Dot', () => {
    it('should add dot to display', () => {
      const stateWithValue = { ...initialState, displayValue: '5' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.inputDot,
      });
      expect(state.displayValue).toBe('5.');
      expect(state.waitingForOperand).toBe(false);
    });

    it('should start with 0. when waiting for operand', () => {
      const stateWaiting = {
        ...initialState,
        waitingForOperand: true,
      };
      const state = calculatorReducer(stateWaiting, {
        type: EInputTypes.inputDot,
      });
      expect(state.displayValue).toBe('0.');
      expect(state.waitingForOperand).toBe(false);
    });
  });

  // NEW: Input Percent tests
  describe('Input Percent', () => {
    it('should convert to percentage', () => {
      const stateWithValue = { ...initialState, displayValue: '50' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.inputPercent,
      });
      expect(state.displayValue).toBe('0.50');
    });

    it('should not change zero', () => {
      const state = calculatorReducer(initialState, {
        type: EInputTypes.inputPercent,
      });
      expect(state.displayValue).toBe('0');
    });

    it('should handle decimal percentage', () => {
      const stateWithValue = { ...initialState, displayValue: '12.5' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.inputPercent,
      });
      expect(state.displayValue).toBe('0.125');
    });
  });

  // NEW: Toggle Sign tests
  describe('Toggle Sign', () => {
    it('should make positive number negative', () => {
      const stateWithValue = { ...initialState, displayValue: '5' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.toggleSign,
      });
      expect(state.displayValue).toBe('-5');
    });

    it('should make negative number positive', () => {
      const stateWithValue = { ...initialState, displayValue: '-5' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.toggleSign,
      });
      expect(state.displayValue).toBe('5');
    });

    it('should toggle zero', () => {
      const state = calculatorReducer(initialState, {
        type: EInputTypes.toggleSign,
      });
      expect(state.displayValue).toBe('0');
    });
  });

  // NEW: Clear Last Character tests
  describe('Clear Last Character', () => {
    it('should remove last digit', () => {
      const stateWithValue = { ...initialState, displayValue: '123' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.clearLastChar,
      });
      expect(state.displayValue).toBe('12');
    });

    it('should set to 0 when removing last digit', () => {
      const stateWithValue = { ...initialState, displayValue: '5' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.clearLastChar,
      });
      expect(state.displayValue).toBe('0');
    });

    it('should handle empty string', () => {
      const stateWithValue = { ...initialState, displayValue: '' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.clearLastChar,
      });
      expect(state.displayValue).toBe('0');
    });
  });

  describe('Perform Operation', () => {
    it('should handle division by zero', () => {
      const stateWithData = {
        value: 5,
        displayValue: '0',
        operator: '/',
        waitingForOperand: false,
      };
      const state = calculatorReducer(stateWithData, {
        type: EInputTypes.performOperation,
        payload: '=',
      });
      expect(state.value).toBe(Infinity);
      expect(state.displayValue).toBe('Infinity');
    });

    it('should handle chained operations', () => {
      let state = calculatorReducer(
        { ...initialState, displayValue: '5' },
        { type: EInputTypes.performOperation, payload: '+' }
      );
      expect(state.value).toBe(5);
      expect(state.operator).toBe('+');
      
      state = calculatorReducer(
        { ...state, displayValue: '3' },
        { type: EInputTypes.performOperation, payload: '=' }
      );
      expect(state.value).toBe(8);
      expect(state.displayValue).toBe('8');
    });

    // NEW: Missing operation tests
    it('should set first operation', () => {
      const state = calculatorReducer(
        { ...initialState, displayValue: '5' },
        { type: EInputTypes.performOperation, payload: '+' }
      );
      expect(state.value).toBe(5);
      expect(state.operator).toBe('+');
      expect(state.waitingForOperand).toBe(true);
    });

    it('should handle all operations', () => {
      const operations = ['+', '-', '*', '/'];
      operations.forEach(op => {
        const state = calculatorReducer(
          { value: 10, displayValue: '5', operator: op, waitingForOperand: false },
          { type: EInputTypes.performOperation, payload: '=' }
        );
        expect(typeof state.value).toBe('number');
        expect(state.displayValue).toBe(String(state.value));
      });
    });

    it('should handle changing operators', () => {
      let state = calculatorReducer(
        { ...initialState, displayValue: '5' },
        { type: EInputTypes.performOperation, payload: '+' }
      );
      
      // Change operator before entering second number
      state = calculatorReducer(state, {
        type: EInputTypes.performOperation,
        payload: '*',
      });
      
      expect(state.operator).toBe('*');
      expect(state.waitingForOperand).toBe(true); // Should be true, not false
      expect(state.value).toBe(10); // 5 + 5 = 10 (calculated with current display)
      expect(state.displayValue).toBe('10');
    });
  });

  describe('Clear Operations', () => {
    it('should clear all state', () => {
      const stateWithData = {
        value: 5,
        displayValue: '123',
        operator: '+',
        waitingForOperand: true,
      };
      const state = calculatorReducer(stateWithData, {
        type: EInputTypes.clearAll,
      });
      expect(state).toEqual(initialState);
    });

    it('should clear display', () => {
      const stateWithValue = { ...initialState, displayValue: '123' };
      const state = calculatorReducer(stateWithValue, {
        type: EInputTypes.clearDisplay,
      });
      expect(state.displayValue).toBe('0');
      // Should preserve other state
      expect(state.value).toBe(null);
      expect(state.operator).toBe(null);
      expect(state.waitingForOperand).toBe(false);
    });

    it('should preserve state except display when clearing display', () => {
      const stateWithData = {
        value: 5,
        displayValue: '123',
        operator: '+',
        waitingForOperand: true,
      };
      const state = calculatorReducer(stateWithData, {
        type: EInputTypes.clearDisplay,
      });
      expect(state.displayValue).toBe('0');
      expect(state.value).toBe(5);
      expect(state.operator).toBe('+');
      expect(state.waitingForOperand).toBe(true);
    });
  });
});
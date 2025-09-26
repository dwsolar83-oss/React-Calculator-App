import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from './Calculator';

describe('<Calculator />', () => {
  const user = userEvent.setup();
  it('should sum correctly', async () => {
    render(<Calculator />);

    await user.click(screen.getByText('6'));
    await user.click(screen.getByText('+'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('='));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('8');
  });

  it('should rest correctly', async () => {
    render(<Calculator />);
    await user.click(screen.getByText('6'));
    await user.click(screen.getByText('-'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('='));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('4');
  });

  it('should divide correctly', async () => {
    render(<Calculator />);
    await user.click(screen.getByText('6'));
    await user.click(screen.getByText('÷'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('='));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('3');
  });

  it('should multiply correctly', async () => {
    render(<Calculator />);
    await user.click(screen.getByText('6'));
    await user.click(screen.getByText('x'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('='));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('12');
  });

  it('should show decimals correctly', async () => {
    render(<Calculator />);

    await user.click(screen.getByText('●'));
    await user.click(screen.getByText('2'));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('0.2');
  });

  it('should invert sign correctly', async () => {
    render(<Calculator />);

    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('±'));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('-2');
  });

  it('should apply % correctly', async () => {
    render(<Calculator />);
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('%'));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('0.02');
  });

  it('should clear the display correctly', async () => {
    render(<Calculator />);
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('3'));
    await user.click(screen.getByText('C'));

    expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('0');
  });

it('should handle chained operations', async () => {
   render(<Calculator />);
  
   // 5 + 3 = 8, then × 2 = 16
   await user.click(screen.getByText('5'));
   await user.click(screen.getByText('+'));
   await user.click(screen.getByText('3'));
   await user.click(screen.getByText('='));
  
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('8');
  
   await user.click(screen.getByText('x'));
   await user.click(screen.getByText('2'));
   await user.click(screen.getByText('='));
  
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('16');
 });

 it('should handle multiple chained operations without equals', async () => {
   render(<Calculator />);
  
   // 10 + 5 - 3 × 2 = 24
   await user.click(screen.getByText('1'));
   await user.click(screen.getByText('0'));
   await user.click(screen.getByText('+'));
   await user.click(screen.getByText('5'));
   await user.click(screen.getByText('-'));
   await user.click(screen.getByText('3'));
   await user.click(screen.getByText('x'));
   await user.click(screen.getByText('2'));
   await user.click(screen.getByText('='));
  
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('24');
 });
it('should handle division by zero', async () => {
   render(<Calculator />);
  
   await user.click(screen.getByText('5'));
   await user.click(screen.getByText('÷'));
   await user.click(screen.getByText('0'));
   await user.click(screen.getByText('='));
  
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('∞');
 });

 it('should handle AC button (clear all)', async () => {
   render(<Calculator />);
  
   // Start a calculation: 5 +
   await user.click(screen.getByText('5'));
   await user.click(screen.getByText('+'));
  
   // Type another number: 3
   await user.click(screen.getByText('3'));
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('3');
  
   // Button should be 'C' since display is '3' (not '0')
   expect(screen.getByText('C')).toBeInTheDocument();
  
   // Use C to clear display to '0' (but keeps "5 +" in memory)
   await user.click(screen.getByText('C'));
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('0');
  
   // Now button should be 'AC' since display is '0'
   expect(screen.getByText('AC')).toBeInTheDocument();
  
   // Use AC to clear ALL state (including the stored "5 +")
   await user.click(screen.getByText('AC'));
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('0');
  
   // Verify everything is truly cleared by starting fresh
   await user.click(screen.getByText('2'));
   await user.click(screen.getByText('='));
  
   // Should show 2 (not 7, which would be 5 + 2 if state wasn't cleared)
   expect(screen.getByTestId('calculator-display-inner')).toHaveTextContent('2');
 });
 it('should show AC initially and C after input', async () => {
   render(<Calculator />);
  
   // Initially should show AC
   expect(screen.getByText('AC')).toBeInTheDocument();
  
   // After input, should show C
   await user.click(screen.getByText('5'));
   expect(screen.getByText('C')).toBeInTheDocument();
   expect(screen.queryByText('AC')).not.toBeInTheDocument();
  
   // After clearing with C, should show AC again
   await user.click(screen.getByText('C'));
   expect(screen.getByText('AC')).toBeInTheDocument();
 });

  
});

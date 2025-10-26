import { render, fireEvent } from '@testing-library/react';
import { CheckboxCell } from './CheckboxCell';

describe('CheckboxCell', () => {
  test('renders as an unchecked checkbox', () => {
    const { getByRole } = render(
      <CheckboxCell checked={false} onChange={() => {}} />
    );
    expect(getByRole('checkbox')).not.toBeChecked();
  });

  test('renders as a checked checkbox', () => {
    const { getByRole } = render(
      <CheckboxCell checked={true} onChange={() => {}} />
    );
    expect(getByRole('checkbox')).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(
      <CheckboxCell checked={false} onChange={handleChange} />
    );
    fireEvent.click(getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('Check icon has opacity-100 class when checked=true', () => {
    const { container } = render(
      <CheckboxCell checked={true} onChange={() => {}} />
    );
    const icon = container.querySelector('svg');
    expect(icon.getAttribute('class')).toMatch(/opacity-100/);
  });

  test('Check icon has opacity-0 class when checked=false', () => {
    const { container } = render(
      <CheckboxCell checked={false} onChange={() => {}} />
    );
    const icon = container.querySelector('svg');
    expect(icon.getAttribute('class')).toMatch(/opacity-0/);
  });
});

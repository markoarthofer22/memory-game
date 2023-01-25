import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import Button from '../index';

describe('Button component tests', () => {
  it('First render with all props passed', () => {
    const component = renderer.create(<Button title="Button title" />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should render a button with the tile "Button title"', () => {
    render(<Button title="Button title" />);
    const button = screen.getByText(/title/i);

    expect(button).toHaveTextContent('Button title');
  });

  it('should be disabled if disabled prop is passed', () => {
    render(<Button disabled title="Button title" />);
    const button = screen.getByText(/title/i);

    expect(button).toBeDisabled();
  });

  it('should be disabled when clicked', async () => {
    let disabled = false;
    const setDisabled = jest.fn(() => (disabled = !disabled));

    const { rerender } = render(
      <Button
        disabled={disabled}
        title="Button title"
        onClick={() => {
          setDisabled();
        }}
      />
    );
    const button = screen.getByText(/title/i);

    expect(button).not.toBeDisabled();

    await user.click(button);

    rerender(
      <Button
        disabled={disabled}
        title="Button title"
        onClick={() => {
          setDisabled();
        }}
      />
    );

    expect(button).toBeDisabled();
  });
});

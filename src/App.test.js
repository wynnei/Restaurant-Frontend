import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
//rendering the App component
describe("App component", () => {
  it("should render App component correctly", () => {
    render(<App />);
    const element = screen.getByRole("heading");
    //check if element exist in DOM 
    expect(element).toBeInTheDocument();
  });
  it("should show error message when any of the form fields are not entered", () => {
    render(<App />);
    const buttonElement = screen.getByRole("button");
    userEvent.click(buttonElement);
});
it("should show alert message before deleting information",async () => {
  render(<App />);
  const buttonElement = screen.getByRole("button");
  await userEvent.click(buttonElement)
  const alertElement = screen.getByRole("alert");
expect(alertElement).toBeInTheDocument();
});
it("should not show any error message when the component is loaded", async () => {
  render(<App />);
  const alertElement = screen.queryByRole("alert");
  expect(alertElement).not.toBeInTheDocument();
});
it("should show success message when all the form details are added successfully.", async () => {
  render(<App />);
  const buttonElement = screen.getByRole("button");
  await userEvent.click(buttonElement);
  const alertElement = screen.getByRole("alert");
  expect(alertElement).toBeInTheDocument();
});
});

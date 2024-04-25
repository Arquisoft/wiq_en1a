import React from 'react';
import { fireEvent, act, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from './AddUser';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';




const mockAxios = new MockAdapter(axios);


describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <AddUser />
      </BrowserRouter>);
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('should add user successfully', async () => {
    render(<BrowserRouter>
      <AddUser />
    </BrowserRouter>);

   
    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText("Password");
    const cpasswordInput = screen.getByLabelText(/Confirm Password/i);
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(cpasswordInput, { target: { value: 'testPassword' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText(/User added successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle wrong passwords when adding user', async () => {
    render(<BrowserRouter>
      <AddUser />
    </BrowserRouter>);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText("Password");
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText("Error: Passwords do not match")).toBeInTheDocument();
    });
  });

  it('should handle error when adding user', async () => {
    render(<BrowserRouter>
      <AddUser />
    </BrowserRouter>);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText("Password");
    const addUserButton = screen.getByRole('button', { name: /Register/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByText("Error: Passwords do not match")).toBeInTheDocument();
    });

    //Close the snackbar by clicking outside
    await act(async ()=>{
      fireEvent.click(screen.getAllByText("Username")[1])
    })

    //Snackbar has to have been closed
    await waitFor(() => {
      expect(screen.queryByText("Error: Passwords do not match")).not.toBeInTheDocument();
    });
  });
});

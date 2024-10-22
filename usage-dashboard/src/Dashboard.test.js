/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import Dashboard from './Dashboard';



// Mock the Bar chart from react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

describe('Dashboard component', () => {
    let mockAxios

    beforeEach(() => {
        mockAxios = new axiosMock(axios);
    })
  const mockData = {
    usage: [
      { message_id: 1, timestamp: '21-10-2023 15:31', reportname: 'Report A', credits_used: 50 },
      { message_id: 2, timestamp: '21-10-2023 15:31', reportname: 'Report B', credits_used: 30 },
    ],
  };

  beforeEach(() => {
    // Mock the API response
    mockAxios.onGet(`${process.env.REACT_APP_API_URL}`).reply(200, mockData);
  });

  afterEach(() => {
    mockAxios.reset();
  });

    test('renders the dashboard and table headers correctly', async () => {
        render(<Dashboard />);
    
        // Verify loading state
        expect(screen.getByText('Credit Usage Dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    
        // Wait for table headers using a regex that ignores the sorting arrows
        await waitFor(() => {
          expect(screen.getByText(/Message ID/)).toBeInTheDocument();
          expect(screen.getByText(/Timestamp/)).toBeInTheDocument();
          expect(screen.getByText(/Report Name/)).toBeInTheDocument();
          expect(screen.getByText(/Credits Used/)).toBeInTheDocument();
        });
      });

  test('renders the correct data from API', async () => {
    render(<Dashboard />);

    // Wait for data to be rendered in the table
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Report A')).toBeInTheDocument();
      expect(screen.getByText('50.00')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Report B')).toBeInTheDocument();
      expect(screen.getByText('30.00')).toBeInTheDocument();
    });
  });

});

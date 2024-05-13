# Simple Expense Tracker (MVP)

## Overview
This Vue.js application provides a comprehensive financial dashboard that allows users to track their transactions, view balances, and analyze their income and expenses through interactive charts. It features a dark mode toggle and supports multiple currencies.

## Features

- **Dark Mode Toggle**: Users can switch between light and dark themes for better visibility according to their preference.
- **Currency Selection**: Supports multiple currencies, allowing users to select and view financial data in their chosen currency.
- **Transaction Management**: Add, view, and delete transactions from a dynamic list.
- **Financial Charts**: Visualize income and expenses with Doughnut charts, providing a clear breakdown of financial activities.
- **Persistent Storage**: Transactions and user preferences (like selected currency and theme) are saved locally to maintain state across sessions.


## Setup and Installation

1. Clone the repository.
2. Install dependencies:
```sh
npm install
```
3. Run the application locally:
```sh
npm run dev
```


## Technologies Used

- Vue.js
- TypeScript
- FontAwesome for icons
- LocalStorage for data persistence
- Vitest for unit testing
- Playwright for end-to-end testing

## Project Structure

- `src/components/`: Contains all the reusable components.
- `src/`: Main source directory containing the Vue application.



## Future Enhancements

- **User Authentication**: Implement user login and registration to personalize and secure user data. This will require reintegrating Vue Router to handle different authentication states and navigation.
- **Date-based Filtering for Charts**: Add functionality to track expenses and income on a weekly and monthly basis through interactive charts.
- **Currency API Integration**: Integrate a currency conversion API to provide more currency options and real-time conversion rates.
- **Extend Currency Support**: Enhance the current currency selection feature to include a broader range of currencies.
- **State Management Upgrade**: Transition from LocalStorage to Pinia for enhanced state management across the application.

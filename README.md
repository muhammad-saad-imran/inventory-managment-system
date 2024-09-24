# Inventory management System

## Table of Contents

- [Inventory management System](#project-name)
  - [Introduction](#introduction)
  - [Packages Used](#packages-used)
  - [Getting Started](#getting-started)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
  - [Technologies](#technologies)
  - [Conclusion](#conclusion)


## Introduction
This project is an inventory management system designed for wholesale stores to efficiently manage all aspects related to suppliers, products, and client interactions.

## Packages Used

- **[`react@^18`](https://www.npmjs.com/package/react)**

- **[`react-dom@^18`](https://www.npmjs.com/package/react-dom)**

- **[`next@^14.2.12`](https://www.npmjs.com/package/next)**

- **[`react-redux@^9.1.2`](https://www.npmjs.com/package/react-redux)**: Provides React bindings for Redux, allowing React components to interact with the Redux store.

- **[`@reduxjs/toolkit@^2.2.7`](https://www.npmjs.com/package/@reduxjs/toolkit)**: The official, recommended way to manage state in Redux, simplifying common tasks like store configuration and state updates.

- **[`@supabase/supabase-js@^2.45.2`](https://www.npmjs.com/package/@supabase/supabase-js)**: A JavaScript client library for Supabase.

- **[`@supabase/ssr@^0.5.1`](https://www.npmjs.com/package/@supabase/ssr)**: Provides utilities for using Supabase in server-side rendering (SSR) environments, improving integration with frameworks like Next.js.

- **[`tailwindcss@^3.4.1`](https://www.npmjs.com/package/tailwindcss)**: A utility-first CSS framework that allows for rapid UI development by applying pre-designed classes directly in the HTML structure.

- **[`formik@^2.4.6`](https://www.npmjs.com/package/formik)**: A form management library for React, simplifying form handling, validation, and submission by using hooks and higher-order components.

- **[`lodash@^4.17.21`](https://www.npmjs.com/package/lodash)**: A utility library offering a wide range of functions for common tasks such as manipulating arrays, objects, and strings in JavaScript.

- **[`dayjs@^1.11.13`](https://www.npmjs.com/package/dayjs)**: A minimalist JavaScript library for parsing, validating, manipulating, and formatting dates, similar to Moment.js but with a smaller footprint.

- **[`react-select@^5.8.0`](https://www.npmjs.com/package/react-select)**: A flexible and customizable select input control for React applications, offering features like multi-select, custom styling, and advanced filtering.

- **[`react-top-loading-bar@^2.3.1`](https://www.npmjs.com/package/react-top-loading-bar)**: A React component for displaying a loading progress bar at the top of the page, enhancing the user experience during data fetching or page transitions.

- **[`styled-components@^6.1.13`](https://www.npmjs.com/package/styled-components)**: A CSS-in-JS library that enables developers to write CSS directly in JavaScript files, allowing for scoped and dynamic styling in React components.

- **[`yup@^1.4.0`](https://www.npmjs.com/package/yup)**: A schema-based form validation library that works with Formik to validate form inputs, providing an easy way to define rules and error messages.

- **[`@testing-library/react@^16.0.1`](https://www.npmjs.com/package/@testing-library/react)**: A testing library that facilitates testing React components by simulating real user interactions and ensuring the UI behaves as expected.

- **[`jest@^29.7.0`](https://www.npmjs.com/package/jest)**: A JavaScript testing framework focused on simplicity and performance, providing a rich API for running tests, mocking, and assertions.

- **[`react-select-event@^5.5.1`](https://www.npmjs.com/package/react-select-event)**: A testing utility designed to simulate user interactions with `react-select` components, allowing for more comprehensive test coverage in your app.

## Getting Started

1. ### Create Supabase project 
  - `supabase` project will be required for the app and to create the project head over to **[this](https://supabase.com/)** website to create a free project.

2. ### Create Database tables
  - Use the **[`migration/schema.sql`](migration/schema.sql)** file to create tables required. You will need to navigate to the `SQL Editor` tab from the sidebar and copy the sql in the file.

3. ### Create a user
  - The user needs to be added from the supabase dashboard. Navigate to the `Authentication` tab and click on `add user` button. These credentials will be required to signin in while using app.

3. ### Environment Variables
  - To link the project you will need to put the `anon key` and `supabase url` in a .env file, you can find these in `settings` page. Use the template below:
  ```
  NEXT_PUBLIC_SUPABASE_URL="your-project-url"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="your-project-anon-key"
  ```

4. ### Install dependencies
  - To install all the dependencies from `package.json` use the command.
  ```
  npm install
  ```

5. ### Start app
  - To run the app use the command
  ```
  npm build 
  npm start
  ```

6. ### Head over to http://localhost:3000 to see the app live!

## Features

### Authentication
- Users must authenticate using a username and password.

### Inventory Management
- Users can add, update, and delete product records.
- Real-time tracking of inventory levels, with alerts when stock reaches a predefined threshold.

### Supplier Management
- Users can add, modify, and delete supplier records.
- Maintains a history of interactions with suppliers, including orders.

### Client Management
- Users can add, modify, and delete client records.
- Maintains a history of interactions with clients.
- Supports the creation and management of client orders.

### Order Management
- Enables the creation, modification, and deletion of purchase orders and invoices.
- Supports multiple payment methods and tracks order statuses.

### Search and Filter
- Provides advanced search and filtering options for products, suppliers, and clients.


## Project Structure

- `/src`, contains all the frontend logic of the app
  - `/src/app`, contains all the pages, this project uses app router **[(click for more information)](https://nextjs.org/docs/app)** 
  - `/src/components`, contains all the reusable components used in pages.
  - `/src/elements`, contains all the html components using styled-components 
  - `/src/store`, contains all redux logic
  - `/src/utils`, contains all utilities used in components or pages
  - `/src/actions`, contains all server actions used
  - `/src/supabase`, contains all the supabase related configurations and factory functions
  - `/src/database`, contains all the repositories that have supabase queries
  - `/src/services`, contains all the services that use repositories and contain data handling logic
  - `/src/hooks`, contains all the custom hooks used
  - `/src/validations`, contains all the `yup` validations used in `useFormik` hook

- `/public`, used to store static assets

- `/migration`, contains database related files

- `/__tests__`, contains all the unit tests

- `/__mocks__`, contains all the mocks used in unit tests

- `/coverage`, contains `html` report after testing

### /


## Testing
- To run the test use the command.
```
npm test
```
- This will generate a comprehensive report in an html file in, **[`coverage/index.html`](coverage/index.html)**

## Technologies
- React
- Next.js
- Supabase

## Conclusion
This system aims to improve the operational efficiency of wholesale stores by providing an integrated solution for inventory, supplier, and client management. Its responsive design, automated processes, and real-time insights will help streamline store operations and minimize manual effort.

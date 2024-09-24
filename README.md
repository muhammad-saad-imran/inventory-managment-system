# Project Name

## Introduction
This project is an inventory management system designed for wholesale stores to efficiently manage all aspects related to suppliers, products, and client interactions.

---

## Packages used

  - `@reduxjs/toolkit@^2.2.7`
  - @supabase/ssr@^0.5.1
  - @supabase/supabase-js": "^2.45.2"
  - dayjs": "^1.11.13"
  - formik": "^2.4.6"
  - lodash": "^4.17.21"
  - next": "^14.2.12"
  - react": "^18"
  - react-dom": "^18"
  - react-redux": "^9.1.2
  - react-select": "^5.8.0
  - react-top-loading-bar": "^2.3.1
  - styled-components": "^6.1.13
  - yup": "^1.4.0
  - @testing-library/react": "^16.0.1
  - jest": "^29.7.0
  - react-select-event": "^5.5.1
  - tailwindcss": "^3.4.1

---

## Functional Requirements

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

---

### Software Interface

#### Backend
- **Database**: PostgreSQL
- **Framework**: Supabase
- **Authentication**: Supabase Authentication
- **Validation**: Yup

#### Frontend
- **Frontend Framework**: Next.js
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Forms**: Formik
- **Routing**: Next.js built-in routing
- **API Communication**: Supabase client SDK
- **Component Library**: Material UI

---

## Conclusion
This system aims to improve the operational efficiency of wholesale stores by providing an integrated solution for inventory, supplier, and client management. Its responsive design, automated processes, and real-time insights will help streamline store operations and minimize manual effort.

# Project Enhancement & Modernization Plan

This document outlines the plan to upgrade the E-commerce project with new features, an improved UI/UX, and advanced capabilities.

---

### **Part 1: Razorpay Integration**

This part focuses on replacing the existing payment gateway with Razorpay for a more streamlined checkout process.

**Backend (Node.js/Express):**

1.  **Install Razorpay SDK:** Add the Razorpay Node.js SDK to backend dependencies (`npm install razorpay`).
2.  **Configure Environment Variables:** Store Razorpay Key ID and Key Secret in the `.env` file.
3.  **Create Payment Routes:**
    *   `POST /api/payment/create-order`: To generate a Razorpay order.
    *   `POST /api/payment/verify`: For payment signature verification.
4.  **Implement Payment Controller:**
    *   **`createOrder`:** Takes amount and currency, calls `razorpay.orders.create()`, and returns the `orderId` to the frontend.
    *   **`verifyPayment`:** Verifies the payment signature received from the client to confirm the transaction and updates the order status in the database.

**Frontend (React):**

1.  **Add Razorpay Script:** Include the Razorpay checkout script in `index.html`.
2.  **Trigger Payment:** On the checkout screen, call the backend to create an order, then use the received `orderId` to open the Razorpay checkout modal.
3.  **Handle Payment Callback:** The `handler` function provided to Razorpay will receive the payment response, which is then sent to the backend for verification.

---

### **Part 2: UI/UX Upgrade with Tailwind CSS and ShadCN**

This section focuses on modernizing the application's look and feel using modern and efficient UI tools.

1.  **Install and Configure ShadCN:** Initialize ShadCN in the project (`npx shadcn-ui@latest init`) to set up the configuration and `components/ui` directory.
2.  **Refactor UI Components:** Systematically replace existing UI elements with ShadCN components for a consistent and modern design:
    *   **`Button`:** Replace all `<button>` elements.
    *   **`Card`:** Re-structure product displays on the home screen.
    *   **`Input` & `Label`:** Upgrade all forms (login, registration, checkout, etc.).
    *   **`Table`:** Modernize any data tables, particularly in the admin dashboard.
    *   **`Toast`:** Use for user-friendly, non-intrusive notifications (e.g., "Item added to cart").
3.  **Layout and Design:** Utilize Tailwind CSS utility classes to improve spacing, alignment, and overall responsiveness.

---

### **Part 3: Admin Dashboard Analytics**

This part details the enhancement of the admin dashboard with valuable analytics and data visualizations.

**Backend:**

1.  **Create Analytics Routes:**
    *   `GET /api/admin/summary`: For high-level stats (total users, orders, revenue).
    *   `GET /api/admin/sales-over-time`: For chart data (e.g., monthly sales).
2.  **Implement Analytics Controller:** Use Mongoose aggregation pipelines to efficiently calculate summary data and time-series sales data.
3.  **Secure Admin Routes:** Ensure all admin-related routes are protected by `auth` and `admin` middleware.

**Frontend:**

1.  **Install Charting Library:** Add `Recharts` to the project (`npm install recharts`).
2.  **Create Admin Dashboard Screen:** Fetch data from the new analytics endpoints.
3.  **Display Analytics:**
    *   Use ShadCN `Card` components to display summary statistics.
    *   Use `Recharts` (`LineChart`, `BarChart`) to visualize sales trends over time.

---

### **Part 4: Export & Reporting**

This section adds features for exporting data and generating documents.

**Backend:**

1.  **CSV Export API:**
    *   Install a CSV library like `papaparse`.
    *   Create a `GET /api/orders/export/csv` route.
    *   The controller will fetch all orders, format them into a CSV string, and set response headers to trigger a file download.
2.  **PDF Invoice Generation:**
    *   Install a PDF library like `pdfkit`.
    *   Create a `GET /api/orders/:id/invoice` route.
    *   The controller will fetch the order details and generate a PDF invoice on the fly, streaming it to the client.

**Frontend:**

1.  **Add Export Buttons:**
    *   On the admin order list screen, add an "Export as CSV" button to hit the CSV export endpoint.
    *   On the order detail screen, add a "Download Invoice" button to hit the PDF invoice endpoint.

---

### **Part 5: Smart Recommendations**

This part focuses on adding a product recommendation feature to enhance user engagement.

**Backend:**

1.  **Simple Recommendations API:**
    *   Create a route: `GET /api/products/:id/recommendations`.
    *   The controller will fetch the current product, identify its category, and return a list of other products from the same category.
2.  **(Optional) Gemini API Integration:**
    *   Add the Google AI SDK (`@google/generative-ai`).
    *   Create a route: `GET /api/products/:id/gemini-recommendations`.
    *   The controller will send product details to the Gemini API with a prompt asking for similar product suggestions and return the text-based response.

**Frontend:**

1.  **Display Recommendations:**
    *   On the product details page, add a "You might also like" section.
    *   Fetch and display products from the simple recommendations API.
    *   (Optional) Add a button or section to show AI-generated recommendations from the Gemini API. 
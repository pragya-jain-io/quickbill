# QuickBill

> Work in Progress

## Project Overview

QuickBill is an offline-first invoice editor built using React and Vite. The goal is to create a simple invoice application that can run without an internet connection and later work as an Android mobile app.

## Completed

### 1. Invoice Editor

- Created the invoice editor using React components.
- Added editable customer details.
- Kept seller and bank details read-only.
- Added editable transport details.
- Added support for adding and removing invoice items.
- Added editable item descriptions, HSN codes, quantities, units, prices and GST rates.
- Added cartage and packing charges.

### 2. Invoice Calculations

- Added automatic taxable amount calculation.
- Added automatic GST calculation.
- Added CGST and SGST calculations for intra-state invoices.
- Added IGST calculation for inter-state invoices.
- Added automatic grand total calculation.
- Handled empty cartage values without calculation errors.
- Added support for decimal prices and amounts.

### 3. Amount in Words

- Added automatic conversion of the grand total into words.
- Supports the Indian numbering system, including Thousand, Lakh and Crore.
- Supports rupees and paise.
- Works completely offline without external APIs or libraries.

### 4. Invoice Preview

- Created a dynamic invoice preview based on the invoice data.
- Used the supplied HTML invoice template as the reference.
- Added seller, customer, transport, item, bank and total details.
- Added the signature image.
- Added Indian currency formatting and date formatting.

### 5. Separate Editor and Preview Pages

- Split the application into two separate pages.
- First page: Invoice Editor.
- Second page: Invoice Preview.
- Added navigation between the two pages.
- Kept invoice data in the parent App component.
- Preserved invoice data when switching between pages.
- No additional routing library required.

### 6. PDF Generation

- Added PDF generation through the browser's native print functionality.
- Added a Download PDF option on the invoice preview page.
- Added print-specific CSS styling.
- Configured A4 landscape page layout.
- Hid navigation buttons from the printed document.
- Preserved invoice table borders, backgrounds and signature.
- Supports offline PDF generation using the browser's Save as PDF option.

### 7. Client Management

- Added client management functionality.
- Added support for saving up to 10 clients.
- Added automatic local storage of client details using localStorage.
- Added the ability to select saved clients and populate invoice customer details.
- Added the ability to update and delete saved clients.
- Added JSON backup functionality to export saved clients.
- Added JSON restore functionality to import previously backed-up clients.
- Added backup validation and a client limit check.
- Kept client data separate from invoice data.
- Works offline without a backend or database.

### 8. Sample Client Backup

- Added a sample generated JSON backup file in the public folder.
- Provides an example of the QuickBill client backup structure.

### 9. Android Application

- Added Capacitor Android integration.
- Configured the Android application with the QuickBill app ID.
- Built and installed the application on a physical Android phone.
- Added a native Android file-saving plugin.
- Integrated Android Storage Access Framework for JSON backup saving.
- Added a native Android PDF printing workflow using PrintManager.
- Added A4 landscape print attributes for Android PDF generation.
- Preserved the existing JSON backup functionality.

## Remaining Work

### Testing and Making it readable on phone by adding zoom in.

- Test the editor, preview, PDF generation and local storage on the phone.
- Make it readable

## Planned Development Order

1. Prepare the Android application using Capacitor.
2. Integrate and test local storage on Android.
3. Test PDF generation on a physical Android phone.
4. Verify complete offline functionality.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| localStorage | Local client data storage |
| Capacitor 8 | Android integration |
| Java | Native Android file-saving plugin |
| Android Storage Access Framework | User-selected file saving |

## Development Principle

QuickBill is being developed as an offline-first application. Invoice and client data should remain on the user's device, and core invoice features should not depend on an internet connection. 
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

## Remaining Work

### 1. Invoice Storage

- Decide how invoices will be saved locally.
- Support creating, saving, opening and editing invoices.
- Make sure saved invoices remain available after closing and reopening the app.
- Decide how invoice numbers will be generated.
- Keep the application fully offline.
- Consider backup and restore functionality.

### 2. Android Mobile App

- Prepare the application for Android using Capacitor.
- Adapt the editor and preview for mobile screens.
- Build and install the app on an Android phone.
- Test the editor, preview, PDF generation and local storage on the phone.
- Verify that the application works without an internet connection.

## Planned Development Order

1. Finalise the local invoice storage approach.
2. Implement invoice saving and loading.
3. Add invoice management and invoice number generation.
4. Prepare the Android application using Capacitor.
5. Integrate and test local storage on Android.
6. Test PDF generation on a physical Android phone.
7. Verify complete offline functionality.

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- Capacitor (planned for Android)

## Development Principle

QuickBill is being developed as an offline-first application. Invoice data should remain on the user's device, and core invoice features should not depend on an internet connection.
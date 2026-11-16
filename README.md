# QuickBill

> Work in Progress

## Project Overview

QuickBill is an offline-first invoice editor built using React and Vite. The goal is to create a simple invoice application that can run without an internet connection and later work as an Android mobile app.

## Completed

### Invoice Editor
- Created the invoice editor using React components.
- Added editable customer details.
- Kept seller and bank details read-only.
- Added editable transport details.
- Added support for adding and removing invoice items.
- Added editable item descriptions, HSN codes, quantities, units, prices and GST rates.
- Added cartage and packing charges.

### Invoice Calculations
- Added automatic taxable amount calculation.
- Added automatic GST calculation.
- Added CGST and SGST calculations for intra-state invoices.
- Added IGST calculation for inter-state invoices.
- Added automatic grand total calculation.
- Handled empty cartage values without calculation errors.
- Added support for decimal prices and amounts.

### Amount in Words
- Added automatic conversion of the grand total into words.
- Supports the Indian numbering system, including Thousand, Lakh and Crore.
- Supports rupees and paise.
- Works completely offline without external APIs or libraries.

### Invoice Preview
- Created a dynamic invoice preview based on the invoice data.
- Used the supplied HTML invoice template as the reference.
- Added seller, customer, transport, item, bank and total details.
- Added the signature image.

## Remaining Work

### 1. Separate Editor and Preview Pages
- Split the current screen into two pages.
- First page: Invoice Editor.
- Second page: Invoice Preview.
- Add navigation between the two pages.
- Keep invoice data available when moving between pages.

### 2. PDF Generation
- Add an option to generate a PDF from the invoice preview.
- Preserve the original invoice layout.
- Check that the PDF is suitable for printing and sharing.

### 3. Invoice Storage
- Decide how invoices will be saved locally.
- Support creating, saving, opening and editing invoices.
- Make sure saved invoices remain available after closing and reopening the app.
- Keep the application fully offline.

### 4. Android Mobile App
- Prepare the application for Android using Capacitor.
- Build and install the app on an Android phone.
- Test the editor, preview, PDF generation and local storage on the phone.
- Check the layout on different screen sizes.
- Verify that the application works without an internet connection.

## Planned Development Order

1. Split the editor and preview into separate pages.
2. Add PDF generation.
3. Finalise the local invoice storage approach.
4. Implement invoice saving and loading.
5. Prepare the Android application.
6. Install and test on a physical Android phone.

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- Capacitor (planned for Android)

## Development Principle

QuickBill is being developed as an offline-first application. Invoice data should remain on the user's device, and core invoice features should not depend on an internet connection.
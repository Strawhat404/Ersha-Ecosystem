# Payment Dashboard API Documentation

This document describes the API endpoints for the Payment Dashboard functionality, including Request Payout, Add Payment Method, Generate Invoice, and View Reports features.

## Base URL
```
/api/payments/
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Payment Dashboard Overview

### Get Dashboard Overview
**GET** `/api/payments/dashboard/overview/`

Get comprehensive dashboard data including balances, transactions, invoices, and charts.

**Query Parameters:**
- `user_id` (required): User ID to get dashboard data for

**Response:**
```json
{
  "total_balance": "5000.00",
  "available_balance": "4500.00",
  "pending_balance": "500.00",
  "total_transactions": 25,
  "completed_transactions": 20,
  "pending_transactions": 3,
  "failed_transactions": 2,
  "success_rate": "80.00",
  "monthly_income": "15000.00",
  "monthly_expenses": "10000.00",
  "net_income": "5000.00",
  "pending_payouts": "500.00",
  "completed_payouts": "2000.00",
  "total_invoices": 15,
  "paid_invoices": 12,
  "overdue_invoices": 2,
  "total_invoice_amount": "25000.00",
  "overdue_invoice_amount": "3000.00",
  "recent_transactions": [...],
  "recent_invoices": [...],
  "payment_methods": [...],
  "monthly_chart_data": [...],
  "payment_method_breakdown": {...},
  "transaction_status_breakdown": {...}
}
```

## 2. Request Payout

### Submit Payout Request
**POST** `/api/payments/dashboard/request_payout/`

Submit a new payout request with validation.

**Request Body:**
```json
{
  "user_id": "user123",
  "amount": "1000.00",
  "currency": "ETB",
  "payment_method": "payment_method_uuid",
  "reason": "Withdrawal for business expenses"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout request submitted successfully",
  "data": {
    "id": "payout_uuid",
    "user_id": "user123",
    "amount": "1000.00",
    "currency": "ETB",
    "status": "pending",
    "processing_fee": "10.00",
    "net_amount": "990.00",
    "payment_method_details": {...},
    "user_balance": "5000.00"
  }
}
```

### Get Payout Requests by User
**GET** `/api/payments/payout-requests/by_user/?user_id=user123`

### Get Pending Payout Requests
**GET** `/api/payments/payout-requests/pending/`

### Process Payout Request
**POST** `/api/payments/payout-requests/{payout_id}/process_payout/`

### Verify Payout Status
**POST** `/api/payments/payout-requests/{payout_id}/verify_status/`

### Get Supported Banks
**GET** `/api/payments/payout-requests/supported_banks/`

## 3. Add Payment Method

### Create Payment Method
**POST** `/api/payments/payment-methods/`

**Request Body:**
```json
{
  "user_id": "user123",
  "method_type": "bank",
  "provider": "commercial_bank",
  "account_number": "1234567890",
  "account_name": "John Doe",
  "bank_name": "Commercial Bank of Ethiopia",
  "branch_code": "001"
}
```

### Get Payment Methods by User
**GET** `/api/payments/payment-methods/by_user/?user_id=user123`

### Get Verified Payment Methods
**GET** `/api/payments/payment-methods/verified/`

### Verify Payment Method
**POST** `/api/payments/payment-methods/{method_id}/verify/`

**Request Body:**
```json
{
  "verification_code": "123456"
}
```

## 4. Generate Invoice

### Generate Invoice from Transaction
**POST** `/api/payments/dashboard/generate_invoice/`

Generate an invoice from an existing transaction.

**Request Body:**
```json
{
  "transaction_id": "TXN-123456",
  "customer_name": "Customer Name",
  "customer_email": "customer@example.com",
  "customer_phone": "+251912345678",
  "customer_address": "Customer Address",
  "due_date": "2024-02-15",
  "description": "Invoice for agricultural products",
  "notes": "Payment due within 30 days"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice generated successfully",
  "invoice_number": "INV-202402-0001",
  "data": {
    "id": "invoice_uuid",
    "invoice_number": "INV-202402-0001",
    "customer_name": "Customer Name",
    "subtotal": "1000.00",
    "total_amount": "1000.00",
    "currency": "ETB",
    "status": "draft",
    "due_date": "2024-02-15"
  }
}
```

### Get Invoices by User
**GET** `/api/payments/invoices/by_user/?user_id=user123`

### Get Overdue Invoices
**GET** `/api/payments/invoices/overdue/`

### Send Invoice
**POST** `/api/payments/invoices/{invoice_id}/send_invoice/`

### Mark Invoice as Paid
**POST** `/api/payments/invoices/{invoice_id}/mark_as_paid/`

### Create Invoice Manually
**POST** `/api/payments/invoices/`

**Request Body:**
```json
{
  "user_id": "user123",
  "customer_name": "Customer Name",
  "customer_email": "customer@example.com",
  "subtotal": "1000.00",
  "tax_amount": "150.00",
  "discount_amount": "50.00",
  "currency": "ETB",
  "due_date": "2024-02-15",
  "items": [
    {
      "description": "Product 1",
      "quantity": "2.0",
      "unit_price": "500.00"
    }
  ]
}
```

## 5. View Reports

### Get Payment Reports
**GET** `/api/payments/dashboard/reports/?user_id=user123&type=summary&start_date=2024-01-01&end_date=2024-01-31`

**Query Parameters:**
- `user_id` (required): User ID
- `type`: Report type (`summary`, `transactions`, `invoices`, `payouts`)
- `start_date`: Start date for report (YYYY-MM-DD)
- `end_date`: End date for report (YYYY-MM-DD)

### Get Analytics Dashboard
**GET** `/api/payments/analytics/dashboard/?user_id=user123`

### Get Performance Metrics
**GET** `/api/payments/analytics/performance_metrics/?user_id=user123`

## 6. Transaction Management

### Get Transactions by User
**GET** `/api/payments/transactions/by_user/?user_id=user123`

### Get Transactions by Status
**GET** `/api/payments/transactions/by_status/?status=completed`

### Get Pending Transactions
**GET** `/api/payments/transactions/pending/`

### Get Completed Transactions
**GET** `/api/payments/transactions/completed/`

### Get Overdue Transactions
**GET** `/api/payments/transactions/overdue/`

## 7. Payment Processing

### Initiate Payment
**POST** `/api/payments/processing/initiate_payment/`

**Request Body:**
```json
{
  "amount": "1000.00",
  "currency": "ETB",
  "provider": "chapa",
  "phone_number": "+251912345678",
  "description": "Payment for agricultural products",
  "user_id": "user123"
}
```

### Verify Payment
**POST** `/api/payments/processing/verify_payment/`

**Request Body:**
```json
{
  "provider": "chapa",
  "transaction_id": "TXN-123456"
}
```

### Get Supported Providers
**GET** `/api/payments/processing/supported_providers/`

## 8. Webhooks

### Chapa Webhook
**POST** `/api/payments/webhooks/chapa/`

### M-Pesa Webhook
**POST** `/api/payments/webhooks/mpesa/`

### Manual Payment Verification
**POST** `/api/payments/webhooks/verify/`

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "details": "Additional error details if available"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per user
- 1000 requests per hour per user

## Security

- All endpoints require JWT authentication
- Sensitive data (account numbers, phone numbers) are masked in responses
- Payment method verification is required before use
- Webhook signatures are verified for security

## Integration with Chapa

The payment system integrates with Chapa payment gateway for:
- Payment processing
- Payout processing
- Bank transfers
- Payment verification

Make sure to configure your Chapa API credentials in the environment variables:
```
CHAPA_API_KEY=your_chapa_api_key
CHAPA_WEBHOOK_SECRET=your_webhook_secret
``` 
C1. How would you prove that our Xero API connection is working before checking invoices?
1.First call the GET /connections endpoint to verify that the OAuth 2.0 authorization is valid and the tenant connection is active.
2.Validate that the access token is not expired and has the required scopes (at least accounting.transactions.read for invoice access).
3.Confirm that the correct Xero-Tenant-ID header is configured for the target organization.
4.Test basic network connectivity to Xero's API endpoints and ensure no firewall or proxy is blocking outbound requests.

C2. If /connections works but GET /Invoices fails, what would you check?
1.Permissions: Verify that the authorized user has invoice read permissions in the Xero organization, and that the OAuth token includes the accounting.transactions.read scope.
2.Request Headers: Ensure the Xero-Tenant-ID header is present and matches the correct organization ID.
3.Request Format: Check for invalid query parameters, incorrect date formats, or malformed pagination parameters.
4.API Version: Confirm you are using a supported API version (Xero regularly deprecates older versions).
5.Account Status: Check if the Xero organization subscription is active or if the user account has been restricted.

C3. What endpoint would you call to check invoices?
GET https://api.xero.com/api.xro/2.0/Invoices

C4. How would you check one specific invoice?
The most reliable method is to retrieve the invoice by its unique identifier:
GET https://api.xero.com/api.xro/2.0/Invoices/{InvoiceID}
Alternatively, you can filter the list endpoint using query parameters such as InvoiceNumber, Status, or Date to locate the specific invoice.

C5. If the invoice API returns 429, how should the backend handle it?
HTTP 429 indicates rate limiting (too many requests). The backend should implement:
1.Exponential backoff retry logic: Automatically retry the request with increasing delays between attempts.
2.Respect the Retry-After response header: Wait the exact number of seconds specified before retrying.
3.Implement client-side rate limiting: Control the number of concurrent requests and requests per second to stay within Xero's limits.
4.Cache frequently accessed invoice data to reduce redundant API calls.
5.Log all 429 errors and set up monitoring alerts to detect sustained rate limiting issues.
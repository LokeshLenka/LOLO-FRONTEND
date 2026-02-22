import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="This Policy explains refunds, cancellations, and failed transactions for paid event registrations on SRKR LOLO."
      effectiveDate="22-Feb-2026"
      version="1"
      sections={[
        {
          id: "scope",
          title: "1. Scope",
          content: (
            <>
              <p>
                This Refund & Cancellation Policy applies to paid registrations
                (including tickets/entry passes where applicable) purchased on
                the SRKR LOLO platform (“Platform”).
              </p>
              <p>
                SRKR LOLO is the official music club of SRKR Engineering
                College, and the Platform is operated by authorized
                administrators under the Institution’s oversight.
              </p>
            </>
          ),
        },
        {
          id: "before-you-pay",
          title: "2. What you see before payment",
          content: (
            <>
              <p>
                Each paid event page will display the registration fee (and any
                additional charges, if applicable) along with the event-specific
                refund/cancellation rules.
              </p>
              <p>
                By completing payment, you acknowledge the event-specific rules
                and this Policy.
              </p>
            </>
          ),
        },
        {
          id: "customer-cancellation",
          title: "3. Customer-initiated cancellation",
          content: (
            <>
              <p>
                Refund eligibility depends on the event’s stated cancellation
                window and conditions shown on the event page.
              </p>
              <p>
                If an event is marked “Non-refundable,” no refund will be
                provided for customer-initiated cancellations, except where
                required by applicable law.
              </p>
            </>
          ),
        },
        {
          id: "event-changes",
          title: "4. Event cancelled / rescheduled",
          content: (
            <>
              <p>
                If SRKR LOLO/authorized organizers cancel an event, eligible
                participants will be offered a refund or an alternative option
                (such as transfer to a rescheduled date) as communicated for
                that event.
              </p>
              <p>
                If an event is rescheduled and you cannot attend, refunds (if
                any) follow the event’s communicated rules.
              </p>
            </>
          ),
        },
        {
          id: "failed-duplicate",
          title: "5. Failed / pending / duplicate transactions",
          content: (
            <>
              <p>
                If your account is debited but the Platform does not confirm
                your registration, or if a duplicate payment occurs, we will
                verify the transaction and initiate a refund where applicable.
              </p>
              <p>
                Please share transaction details (email/phone used, event name,
                amount, transaction reference) via the Contact page for faster
                resolution.
              </p>
            </>
          ),
        },
        {
          id: "how-refunds-work",
          title: "6. Refund processing",
          content: (
            <>
              <p>
                Refunds are initiated to the original payment method where
                supported by our payment partner(s).
              </p>
              <p>
                Once initiated, the time for the refund to reflect depends on
                the payment method, bank, and network rules.
              </p>
            </>
          ),
        },
        {
          id: "fees",
          title: "7. Fees and deductions",
          content: (
            <>
              <p>
                If any platform/convenience fee or payment processing fee is
                charged, whether it is refundable will be stated on the event
                page or checkout screen.
              </p>
            </>
          ),
        },
        {
          id: "contact",
          title: "8. Contact for refund requests",
          content: (
            <>
              <p>
                For refund or payment issues, contact us using the “Contact Us”
                page on the Platform.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

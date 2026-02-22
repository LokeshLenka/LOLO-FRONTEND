import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="These Terms govern access to SRKR LOLO, including event registration, credits, and (if enabled) payments."
      effectiveDate="20-Feb-2026"
      version="1"
      sections={[
        {
          id: "about",
          title: "1. About SRKR LOLO",
          content: (
            <>
              <p>
                SRKR Engineering College is the educational institution. SRKR
                LOLO (Living Out Loud Originals) is SRKR's official music club.
              </p>
              <p>
                This website and related services are maintained by the Club
                and/or authorized administrators under the Institution's
                oversight. Throughout these Terms, “we”, “us”, and “our” refer
                to SRKR and its authorized administrators (including the Club)
                operating the Platform.
              </p>
              <p>
                By accessing or using the Platform, you agree to comply with
                these Terms.
              </p>
            </>
          ),
        },
        {
          id: "eligibility",
          title: "2. Eligibility & authorization",
          content: (
            <>
              <p>
                Access is limited to verified SRKR students, faculty/staff, and
                other participants explicitly authorized by SRKR.
              </p>
              <p>
                We may verify identity and may suspend access while verification
                is pending.
              </p>
            </>
          ),
        },
        {
          id: "accounts",
          title: "3. Accounts & security",
          content: (
            <>
              <p>
                You are responsible for maintaining the confidentiality of your
                credentials and for activity under your account.
              </p>
              <p>Notify us immediately if you suspect unauthorized access.</p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "4. Acceptable use",
          content: (
            <>
              <p>
                Do not attempt unauthorized access, disrupt services, submit
                false data, or interfere with security controls.
              </p>
              <p>
                Violations may lead to suspension/termination and institutional
                disciplinary action where applicable.
              </p>
            </>
          ),
        },
        {
          id: "payments",
          title: "5. Event registrations & payments",
          content: (
            <>
              <p>
                Where paid registrations are enabled, payments are processed
                through our payment partner(s). We do not store your full card
                details or CVV on our servers.
              </p>
              <p>
                A payment is treated as successful only after confirmation from
                the payment partner and after the Platform completes server-side
                verification (for example, signature verification and/or webhook
                validation as applicable).
              </p>
              <p>
                Refunds, cancellations, and dispute handling follow (a) the
                event-specific rules shown on the event page and (b) our Refund
                & Cancellation Policy available on the Platform.
              </p>
            </>
          ),
        },

        {
          id: "credits",
          title: "6. Credits, audits & integrity",
          content: (
            <>
              <p>
                Credits displayed in the Platform may require organizer/admin
                validation and may be audited or corrected by SRKR.
              </p>
              <p>
                Attempts to manipulate credits or attendance records may result
                in disciplinary action.
              </p>
            </>
          ),
        },
        {
          id: "ip",
          title: "7. Intellectual property",
          content: (
            <>
              <p>
                Platform code, UI, branding, and documentation are owned by SRKR
                and/or licensors unless otherwise stated.
              </p>
            </>
          ),
        },
        {
          id: "liability",
          title: "8. Availability & limitation of liability",
          content: (
            <>
              <p>
                The Platform is provided “as is” and “as available”. Downtime
                may occur due to maintenance, incidents, or force majeure.
              </p>
              <p>
                To the maximum extent permitted by law, SRKR is not liable for
                indirect or consequential damages.
              </p>
            </>
          ),
        },
        // {
        //   id: "law",
        //   title: "9. Governing law",
        //   content: (
        //     <>
        //       <p>
        //         These Terms are governed by the laws of India, with jurisdiction
        //         in Andhra Pradesh courts (subject to applicable law).
        //       </p>
        //     </>
        //   ),
        // },
      ]}
    />
  );
}

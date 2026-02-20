import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="This Policy explains what personal data SRKR LOLO collects, why it is collected, and how it is protected."
      effectiveDate="20-Feb-2026"
      version="1"
      sections={[
        {
          id: "controller",
          title: "1. Data controller",
          content: (
            <>
              <p>
                SRKR Engineering College is the Data Controller / Data Fiduciary
                for personal data processed via this Platform.
              </p>
              <p>
                SRKR LOLO (Living Out Loud Originals), the official music club
                of SRKR Engineering College, may act as an authorized
                administrator operating the Platform on behalf of SRKR.
              </p>
              <p>Privacy contact: bandloloplays@gmail.com</p>
            </>
          ),
        },
        {
          id: "data",
          title: "2. Data we collect",
          content: (
            <>
              <p>
                We may collect identity/contact information (name, email,
                registration ID, department and other student personal academic
                info), event participation data, and technical logs (IP,
                device/browser, login timestamps).
              </p>
              <p>
                For, we may store Razorpay identifiers such as Payment ID/Order
                ID and transaction status, but not full card numbers or CVV.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "3. How we use data",
          content: (
            <>
              <p>
                We use data to manage accounts, event registrations, credit
                tracking, platform security, fraud prevention, notifications,
                and operational analytics.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "4. Sharing and disclosures",
          content: (
            <>
              <p>
                We do not sell personal data. We may share personal data with
                authorized SRKR administrators/organizers and service providers
                used to operate the Platform and Razorpay for payment processing
                where applicable.
              </p>
              <p>
                We may also disclose information where required by law or to
                protect the security and integrity of the Platform.
              </p>
            </>
          ),
        },
        {
          id: "security",
          title: "5. Security",
          content: (
            <>
              <p>
                We use reasonable safeguards such as HTTPS, role-based access
                control, and audit logs for sensitive actions.
              </p>
              <p>
                No system is completely secure, so absolute security cannot be
                guaranteed.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "6. Retention",
          content: (
            <>
              <p>
                Data is retained as needed for active accounts, institutional
                record keeping, audits, dispute resolution, and legal
                compliance.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          title: "7. Your rights",
          content: (
            <>
              <p>
                Subject to applicable law and institutional policy, you may
                request access, correction, or deletion (where applicable).
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "8. Cookies",
          content: (
            <>
              <p>
                We may use cookies for session authentication, security, and
                performance. You can control cookies via browser settings.
              </p>
            </>
          ),
        },
        {
          id: "updates",
          title: "9. Updates to this policy",
          content: (
            <>
              <p>
                We may update this Policy and will post the updated version with
                a revised effective date.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

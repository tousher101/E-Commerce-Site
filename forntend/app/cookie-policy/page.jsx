export default function CookiePolicy() {
  return (
    <div className="max-w-[1380px] mx-[10px] py-10 px-5 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <p className="mb-4">
        This Cookie Policy explains how we use cookies and similar technologies
        on our website to provide you with a better, faster, and safer browsing
        experience. By using our site, you agree to the use of cookies as
        described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">1. What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files that are stored on your device when you
        visit a website. They help the site recognize your device and remember
        information about your preferences and actions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Cookies</h2>
      <p className="mb-4">
        We use cookies to improve your shopping experience and ensure our
        website works properly. Specifically, we use cookies to:
      </p>
      <ul className="list-disc pl-8 mb-4">
        <li>Remember your login session and authentication status.</li>
        <li>Keep items in your shopping cart.</li>
        <li>Save your preferences such as language or region.</li>
        <li>Analyze site performance and user behavior to improve our services.</li>
        <li>Display personalized recommendations and promotions.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">3. Types of Cookies We Use</h2>
      <ul className="list-disc pl-8 mb-4">
        <li>
          <strong>Essential Cookies:</strong> Necessary for the operation of the
          website (e.g., login, checkout).
        </li>
        <li>
          <strong>Functional Cookies:</strong> Help us remember your choices and
          personalize your experience.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Used to understand how visitors
          use our site to improve performance.
        </li>
        <li>
          <strong>Marketing Cookies:</strong> Used to show relevant ads and
          measure ad effectiveness.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">4. Managing Cookies</h2>
      <p className="mb-4">
        You can manage or disable cookies through your browser settings. However,
        please note that disabling cookies may affect some website functions such
        as login, checkout, or saved preferences.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Third-Party Cookies</h2>
      <p className="mb-4">
        Some cookies are set by third-party services we use, such as analytics
        tools or payment gateways. We do not control these cookies and recommend
        checking their respective privacy policies.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Updates to This Policy</h2>
      <p className="mb-4">
        We may update this Cookie Policy from time to time to reflect changes in
        our practices or legal requirements. Any updates will be posted on this
        page with the revised date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Cookie Policy, please contact us at:
      </p>
      <p className="font-medium">📧 tousherfana70@gmail.com</p>

      <p className="text-sm text-gray-500 mt-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

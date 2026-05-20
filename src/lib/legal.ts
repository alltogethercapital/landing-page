export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const UPDATED = "May 19, 2026";
const ENTITY = "All Together Capital";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "privacy-policy": {
    title: "Privacy Policy",
    updated: UPDATED,
    intro: `This Privacy Policy explains how ${ENTITY} ("we", "us", or "our") handles information collected through this website. We respect your privacy and aim to be transparent about the limited data this site uses.`,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Information you provide directly — for example, your name and email address when you contact us or send us materials.",
          "Information collected automatically — such as your browser type, device, approximate location, and how you interact with the site, gathered through standard logs and analytics.",
        ],
      },
      {
        heading: "How we use information",
        body: [
          "We use the information to respond to your inquiries, to operate, maintain, and improve the site, to communicate with you where you have asked us to, and to protect the security and integrity of our services.",
        ],
      },
      {
        heading: "Cookies and analytics",
        body: [
          "We may use cookies and similar technologies to understand how the site is used and to remember your preferences. You can control or disable cookies through your browser settings; some features may not function as intended if you do.",
        ],
      },
      {
        heading: "How we share information",
        body: [
          "We do not sell your personal information. We may share information with trusted service providers who help us operate the site, or where required to comply with the law, enforce our terms, or protect rights and safety.",
        ],
      },
      {
        heading: "Data retention and security",
        body: [
          "We keep personal information only for as long as needed for the purposes described here, and we use reasonable safeguards to protect it. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You may request access to, correction of, or deletion of your personal information, and you may opt out of communications at any time. To make a request, contact us using the details below.",
        ],
      },
      {
        heading: "Third-party links",
        body: [
          "This site links to portfolio companies and other third-party websites that we do not control. Their privacy practices are governed by their own policies, and we encourage you to review them.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this Privacy Policy from time to time. Material changes will be reflected by the “Last updated” date above.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about this policy can be sent to hello@alltogethercapital.com.",
        ],
      },
    ],
  },

  "terms-of-service": {
    title: "Terms of Service",
    updated: UPDATED,
    intro: `These Terms of Service govern your use of the ${ENTITY} website. By accessing or using this site, you agree to these terms. If you do not agree, please do not use the site.`,
    sections: [
      {
        heading: "Use of the site",
        body: [
          "This site is provided for general informational purposes. You agree to use it lawfully and not to disrupt, damage, or attempt to gain unauthorized access to the site or its systems.",
        ],
      },
      {
        heading: "No investment advice",
        body: [
          "Nothing on this site is an offer to sell or a solicitation of an offer to buy any security or interest in any fund, nor is it investment, legal, accounting, or tax advice. Any offering is made only through formal documentation to eligible investors.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The content, design, and branding on this site are owned by us or our licensors and are protected by applicable law. Company names, logos, and trademarks of our portfolio companies and third parties belong to their respective owners.",
        ],
      },
      {
        heading: "External links",
        body: [
          "The site links to third-party websites, including our portfolio companies. We are not responsible for the content, accuracy, or practices of those sites.",
        ],
      },
      {
        heading: "Disclaimers and limitation of liability",
        body: [
          "The site is provided “as is” and “as available” without warranties of any kind, express or implied. To the fullest extent permitted by law, we are not liable for any damages arising from your use of, or inability to use, the site.",
        ],
      },
      {
        heading: "Changes to these terms",
        body: [
          "We may update these terms from time to time. Continued use of the site after changes take effect constitutes acceptance of the revised terms.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws principles.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about these terms can be sent to hello@alltogethercapital.com.",
        ],
      },
    ],
  },

  disclaimer: {
    title: "Disclaimer",
    updated: UPDATED,
    intro: `The information on the ${ENTITY} website is provided for general informational purposes only. Please read the following carefully.`,
    sections: [
      {
        heading: "Not an offer",
        body: [
          "Nothing on this site constitutes an offer to sell, or a solicitation of an offer to buy, any security or interest in any fund. Any such offer would be made only through definitive offering documents to qualified investors and in accordance with applicable law.",
        ],
      },
      {
        heading: "Not investment, legal, or tax advice",
        body: [
          "Content on this site is not investment, legal, accounting, or tax advice and should not be relied upon as such. You should consult your own professional advisers before making any decision.",
        ],
      },
      {
        heading: "Forward-looking statements",
        body: [
          "This site may contain forward-looking statements about markets, technologies, and companies. These reflect current views, involve risks and uncertainties, and are not guarantees of any future outcome.",
        ],
      },
      {
        heading: "Portfolio companies",
        body: [
          "References to portfolio companies are for illustration and do not constitute a recommendation or endorsement. A reference to any company does not imply that an investment was profitable, and past performance is not indicative of future results.",
        ],
      },
      {
        heading: "External content",
        body: [
          "We link to third-party websites and resources that we do not control and have not independently verified. We are not responsible for their content or availability.",
        ],
      },
      {
        heading: "Accuracy",
        body: [
          "While we aim to keep information accurate and current, we make no warranty as to its completeness or reliability, and content may change without notice.",
        ],
      },
    ],
  },
};

import type { ComponentType } from "react";
import { LinkedInIcon, MailIcon } from "@/components/icons";

// Emails to the fund reach both founding partners (both on the To line).
export const CONTACT_RECIPIENTS = [
  "robertneir@alltogethercapital.com",
  "hisham@alltogethercapital.com",
];
export const CONTACT_MAILTO = `mailto:${CONTACT_RECIPIENTS.join(",")}`;

export type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export const SOCIALS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/all-together-capital/",
    Icon: LinkedInIcon,
  },
  { label: "Email", href: CONTACT_MAILTO, Icon: MailIcon },
];

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Our companies", href: "/companies" },
  { label: "Our founders", href: "/founders" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: CONTACT_MAILTO },
];

export const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

import type { ComponentType } from "react";
import { LinkedInIcon, MailIcon } from "@/components/icons";

export const CONTACT_RECIPIENT = "robertneir@alltogethercapital.com";
export const CONTACT_CC = "hisham@alltogethercapital.com";
export const CONTACT_RECIPIENTS = [CONTACT_RECIPIENT, CONTACT_CC];
export const CONTACT_MAILTO = `mailto:${CONTACT_RECIPIENT}?cc=${encodeURIComponent(
  CONTACT_CC,
)}`;

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
  { label: "Our team", href: "/team" },
  { label: "Updates", href: "/updates" },
];

export const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Disclaimer", href: "/legal/disclaimer" },
];

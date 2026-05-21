import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight, LinkedInIcon, MailIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our team — All Together Capital",
  description:
    "All Together Capital is led by founding partners Robert Neir and Hisham El-Husseini.",
};

type Member = {
  name: string;
  role: string;
  img: string;
  linkedin?: string;
  email?: string;
  website?: { label: string; href: string };
};

const MEMBERS: Member[] = [
  {
    name: "Robert Neir",
    role: "Founding Partner",
    img: "/leadership/robert.jpg",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robertneir@alltogethercapital.com",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/leadership/hisham.jpg",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@alltogethercapital.com",
  },
  {
    name: "NEO",
    role: "Head of Robotics",
    img: "/leadership/neo.jpg",
    website: { label: "1x.tech", href: "https://www.1x.tech/" },
  },
];

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-[#0b0b0d]">
      {/* Headshot — grayscale until hovered */}
      <Image
        src={m.img}
        alt={m.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={90}
        className="object-cover object-center grayscale transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
      />

      {/* Legibility gradient — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/35" />

      {/* Overlay: name + role always shown; links reveal on hover (desktop) */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <h3 className="text-[24px] font-semibold tracking-[-0.6px] text-white md:text-[28px]">
          {m.name}
        </h3>
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ff4400] md:text-[12px]">
          {m.role}
        </p>
        <div className="mt-4 flex items-center gap-2.5 opacity-100 transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on LinkedIn`}
              className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
            >
              <LinkedInIcon className="size-4" />
            </a>
          )}
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              aria-label={`Email ${m.name}`}
              className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
            >
              <MailIcon className="size-4" />
            </a>
          )}
          {m.website && (
            <a
              href={m.website.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} — ${m.website.label}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-[12px] font-medium text-white/85 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
            >
              {m.website.label}
              <ArrowUpRight className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      <section className="px-6 pt-[110px] pb-24 md:px-[40px] md:pt-[150px] md:pb-32">
        <h1 className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#0b0b0d]/45">
          Leadership
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {MEMBERS.map((m) => (
            <MemberCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

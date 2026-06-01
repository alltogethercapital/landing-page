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
    img: "/leadership/robert-studio.jpg",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robertneir@alltogethercapital.com",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/leadership/hisham-studio.jpg",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@alltogethercapital.com",
  },
  {
    name: "NEO",
    role: "Head of Robotics",
    img: "/leadership/neo-studio.jpg",
    website: { label: "1x.tech", href: "https://www.1x.tech/" },
  },
];

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="group relative grid aspect-[674/720] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] max-md:aspect-[4/5]">
      <div className="relative min-h-0 overflow-hidden bg-white">
        <Image
          src={m.img}
          alt={m.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
      </div>

      <div className="border-t border-black/[0.06] px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
        <h3 className="text-[25px] font-medium leading-[1.02] tracking-[-0.7px] text-[#0b0b0d] md:text-[32px]">
          {m.name}
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ff4400] md:text-[12px]">
          {m.role}
        </p>
        <div className="mt-4 flex items-center gap-2.5 opacity-100 transition-all duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on LinkedIn`}
              className="flex size-9 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/65 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
            >
              <LinkedInIcon className="size-4" />
            </a>
          )}
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              aria-label={`Email ${m.name}`}
              className="flex size-9 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/65 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
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
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 text-[12px] font-medium text-[#0b0b0d]/65 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
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
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m) => (
            <MemberCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

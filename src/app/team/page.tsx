import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Team — All Together Capital",
  description:
    "All Together Capital is led by founding partners Robert Neir and Hisham El-Husseini.",
};

type Member = {
  name: string;
  role: string;
  img: string;
  href: string;
};

const MEMBERS: Member[] = [
  {
    name: "Robert Neir",
    role: "Founding Partner",
    img: "/robert.jpg",
    href: "https://www.linkedin.com/in/robertmneir/",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/hisham.jpg",
    href: "https://www.linkedin.com/in/hisham-el-husseini/",
  },
  {
    name: "NEO",
    role: "Head of Robotics",
    img: "/robot.jpg",
    href: "https://www.1x.tech/",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      <section className="px-6 pt-[110px] pb-24 md:px-[40px] md:pt-[150px] md:pb-32">
        <h1 className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#0b0b0d]/45">
          Leadership
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
          {MEMBERS.map((m) => (
            <a
              key={m.name}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-[271/460] w-full overflow-hidden rounded-2xl bg-black/5">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  quality={90}
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[24px] font-semibold tracking-[-0.6px] text-[#0b0b0d] md:text-[28px]">
                    {m.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.18em] text-[#ff4400]">
                    {m.role}
                  </p>
                </div>
                <ArrowUpRight className="mt-1.5 size-5 shrink-0 text-[#0b0b0d]/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff4400]" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

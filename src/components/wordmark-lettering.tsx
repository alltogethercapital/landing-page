import Image from "next/image";
import {
  DEFAULT_WORDMARK,
  WORDMARK_HEIGHT,
  WORDMARK_OPTIONS,
  WORDMARK_WIDTH,
} from "@/lib/wordmark-options";

/** Approved Reference 2 lettering accompanies the current live wing symbol. */
export function WordmarkLettering() {
  const option = WORDMARK_OPTIONS[DEFAULT_WORDMARK - 1];
  return (
    <Image
      src={option.src}
      alt="MACHINE SPIRIT"
      width={WORDMARK_WIDTH}
      height={WORDMARK_HEIGHT}
      loading="eager"
      unoptimized
      className="cog-wordmark-lettering"
      data-wordmark={DEFAULT_WORDMARK}
    />
  );
}

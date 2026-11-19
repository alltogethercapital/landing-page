import type { Company } from "@/lib/portfolio";

/**
 * A whisper-quiet market label shown on every company card. It is derived from
 * the company's data: a `publicListing` means the position was bought on the
 * public markets; everything else is a private investment. The exchange and
 * ticker of a public position appear only while its card is hovered or focused.
 */
export function MarketTag({ company, id }: { company: Pick<Company, "publicListing">; id?: string }) {
  const listing = company.publicListing;
  const market = listing ? "public" : "private";
  return (
    <span className="market-tag" data-market={market} id={id}>
      <span className="market-tag-label">{listing ? "Public" : "Private"}</span>
      {listing ? (
        <span className="market-tag-ticker">
          {" · "}
          {listing.exchange}: {listing.ticker}
        </span>
      ) : null}
    </span>
  );
}

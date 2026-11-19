import type { Company } from "@/lib/portfolio";

/**
 * A whisper-quiet "Public" label for a position bought on the public markets
 * (a company with `publicListing`). Private positions carry no label. The
 * exchange and ticker appear only while the card is hovered or focused.
 */
export function MarketTag({ company, id }: { company: Pick<Company, "publicListing">; id?: string }) {
  const listing = company.publicListing;
  if (!listing) return null;
  return (
    <span className="market-tag" id={id}>
      <span className="market-tag-label">Public</span>
      <span className="market-tag-ticker">
        {" · "}
        {listing.exchange}: {listing.ticker}
      </span>
    </span>
  );
}

type Orderable = { id: string; sortOrder: number };

/** Move one row up or down within an ordered list by rewriting sort_order.
 *
 *  The list may start with duplicate/zero sort_order values (the table
 *  default), so rather than swap two values we compute the desired final order
 *  and renumber every row to a clean 1..N sequence in a single pass. Safe
 *  no-op at the ends. The `update` callback persists one row's new sort_order,
 *  keeping this helper agnostic of which Prisma model it's reordering. */
export async function reorderSwap(
  update: (id: string, sortOrder: number) => Promise<unknown>,
  items: Orderable[],
  id: string,
  direction: "up" | "down"
): Promise<void> {
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const ordered = [...items];
  [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];

  for (let i = 0; i < ordered.length; i++) {
    await update(ordered[i].id, i + 1);
  }
}

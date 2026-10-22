// What the page and the sponsor know of a Cardano network without reading the
// chain: epochs and slots, from the clock, and where its transactions can be
// seen. No dependency: the survey site uses this module too.

// The time (s), slot and epoch from which slots last 1 s and epochs have a
// fixed length (s).
const NETWORKS = {
  preview: { start: 1_666_656_000, slot: 0, epoch: 0, epochLength: 86_400, explorer: "https://preview.cardanoscan.io" },
  preprod: { start: 1_655_769_600, slot: 86_400, epoch: 4, epochLength: 432_000, explorer: "https://preprod.cardanoscan.io" },
  mainnet: { start: 1_596_059_091, slot: 4_492_800, epoch: 208, epochLength: 432_000, explorer: "https://cardanoscan.io" },
};

/** The epoch at a time (ms). */
export function epochAt(network, time = Date.now()) {
  const { start, epoch, epochLength } = networkOf(network);
  return epoch + Math.floor((time / 1000 - start) / epochLength);
}

/** When an epoch ends (ms): a survey takes responses until the end of its end epoch. */
export function epochEnd(network, epoch) {
  const { start, epoch: first, epochLength } = networkOf(network);
  return (start + (epoch + 1 - first) * epochLength) * 1000;
}

/** When a slot starts (ms). */
export function slotTime(network, slot) {
  const { start, slot: first } = networkOf(network);
  return (start + slot - first) * 1000;
}

/** A transaction's metadata in an explorer: where its response shows. */
export function transactionUrl(network, txId) {
  return `${networkOf(network).explorer}/transaction/${txId}?tab=metadata`;
}

function networkOf(network) {
  if (!Object.hasOwn(NETWORKS, network)) throw new Error(`unknown network ${network}`);
  return NETWORKS[network];
}

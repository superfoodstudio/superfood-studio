const GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://ivory-historic-penguin-632.mypinata.cloud';
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN || '';

export function ipfsUrl(cidOrUrl: string): string {
  if (!cidOrUrl) return '';
  // Don't transform non-IPFS URLs (e.g. regular https images)
  if (cidOrUrl.startsWith('http') && !cidOrUrl.includes('/ipfs/')) return cidOrUrl;
  // Extract CID from legacy full URLs
  const cid = cidOrUrl.includes('/ipfs/')
    ? cidOrUrl.split('/ipfs/').pop()!
    : cidOrUrl;
  const tokenParam = GATEWAY_TOKEN ? `?pinataGatewayToken=${GATEWAY_TOKEN}` : '';
  return `${GATEWAY_URL}/ipfs/${cid}${tokenParam}`;
}

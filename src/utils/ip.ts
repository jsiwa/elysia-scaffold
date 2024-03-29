export function ipToLong(ip: string): number {
  return ip.split('.')
           .map(Number)
           .reduce((acc, octet) => acc * 256 + octet, 0)
}

export function longToIp(long: number): string {
  const octets = []
  for (let i = 3; i >= 0; i--) {
    octets.unshift((long >> (i * 8)) & 255);
  }
  return octets.join('.')
}
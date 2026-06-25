import { useEffect, useState } from "preact/hooks";

interface ZoneConfig {
  cx?: string;
  cy?: string;
  width?: string;
  height?: string;
  hideRadius?: string;
  shiftRadius?: string;
}

interface DotMaskProps {
  zones?: ZoneConfig[];
  cx?: string;
  cy?: string;
  width?: string;
  height?: string;
  hideRadius?: string;
  shiftRadius?: string;
  filter?: string;
  centerOpacity?: string;
  bgColor?: string;
  scrollTrack?: number;
}

function parsePct(v: string): number {
  return parseFloat(v) || 0;
}

function zoneGradient(
  zone: ZoneConfig,
  type: 'cover' | 'ring',
  centerOpacity: string,
  scrollOffset: number,
): string {
  const w = zone.width || '900px';
  const h = zone.height || '600px';
  const cx = zone.cx || '50%';
  const cy = `${parsePct(zone.cy || '30%') - scrollOffset}%`;
  const hide = zone.hideRadius || '40%';
  const shift = zone.shiftRadius || '50%';

  let g: string;
  if (type === 'cover') {
    g = `rgba(0,0,0,${centerOpacity}) 0%, rgba(0,0,0,0) ${hide}, rgba(0,0,0,0) 100%`;
  } else {
    g = `rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${hide}, rgba(0,0,0,0) ${shift}, rgba(0,0,0,0) 100%`;
  }
  return `radial-gradient(ellipse ${w} ${h} at ${cx} ${cy}, ${g})`;
}

function buildGradients(
  zones: ZoneConfig[],
  type: 'cover' | 'ring',
  centerOpacity: string,
  scrollOffset: number,
): string {
  if (zones.length === 0) return 'transparent';
  return zones.map(z => zoneGradient(z, type, centerOpacity, scrollOffset)).join(', ');
}

export function DotMask({
  zones,
  cx = '50%',
  cy = '30%',
  width = '900px',
  height = '600px',
  hideRadius = '40%',
  shiftRadius = '50%',
  filter = 'hue-rotate(60deg) saturate(1.5)',
  centerOpacity = '0.85',
  bgColor,
  scrollTrack = 0,
}: DotMaskProps) {
  const zonesArr = zones ?? [{ cx, cy, width, height, hideRadius, shiftRadius }];
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    if (!scrollTrack) return;

    const onScroll = () => {
      setScrollOffset(window.scrollY * scrollTrack / window.innerHeight * 100);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTrack]);

  const ringImage = buildGradients(zonesArr, 'ring', centerOpacity, scrollOffset);
  const coverImage = buildGradients(zonesArr, 'cover', centerOpacity, scrollOffset);

  const vars = {
    '--dm-filter': filter,
    ...(bgColor ? { '--dm-bg': bgColor } : {}),
  } as Record<string, string>;

  const ringStyle = {
    ...vars,
    maskImage: ringImage,
    WebkitMaskImage: ringImage,
  } as Record<string, string>;

  const coverStyle = {
    ...vars,
    maskImage: coverImage,
    WebkitMaskImage: coverImage,
  } as Record<string, string>;

  return (
    <>
      <div class="dot-mask-ring" style={ringStyle} />
      <div class="dot-mask-cover" style={coverStyle} />
    </>
  );
}

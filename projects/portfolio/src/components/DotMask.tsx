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
}

function zoneGradient(
  zone: ZoneConfig,
  type: 'cover' | 'ring',
  centerOpacity: string,
): string {
  const w = zone.width || '900px';
  const h = zone.height || '600px';
  const cx = zone.cx || '50%';
  const cy = zone.cy || '30%';
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
): string {
  if (zones.length === 0) return 'transparent';
  return zones.map(z => zoneGradient(z, type, centerOpacity)).join(', ');
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
}: DotMaskProps) {
  const zonesArr = zones ?? [{ cx, cy, width, height, hideRadius, shiftRadius }];
  const ringImage = buildGradients(zonesArr, 'ring', centerOpacity);
  const coverImage = buildGradients(zonesArr, 'cover', centerOpacity);

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

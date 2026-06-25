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

const BOTTOM_FADE = 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)';

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

function buildMask(
  zones: ZoneConfig[],
  type: 'cover' | 'ring',
  centerOpacity: string,
): { image: string; composite: string } {
  const grads = zones.length > 0
    ? zones.map(z => zoneGradient(z, type, centerOpacity))
    : [];

  if (grads.length === 0) {
    return { image: BOTTOM_FADE, composite: '' };
  }

  grads.push(BOTTOM_FADE);

  const composites: string[] = [];
  for (let i = 0; i < grads.length - 2; i++) {
    composites.push('add');
  }
  composites.push('intersect');

  return {
    image: grads.join(', '),
    composite: composites.join(', '),
  };
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
  const ringMask = buildMask(zonesArr, 'ring', centerOpacity);
  const coverMask = buildMask(zonesArr, 'cover', centerOpacity);

  const vars = {
    '--dm-filter': filter,
    '--dm-center-opacity': centerOpacity,
    ...(bgColor ? { '--dm-bg': bgColor } : {}),
  } as Record<string, string>;

  const ringStyle = {
    ...vars,
    maskImage: ringMask.image,
    maskComposite: ringMask.composite,
    WebkitMaskImage: ringMask.image,
    WebkitMaskComposite: ringMask.composite ? 'source-in' : '',
  } as Record<string, string>;

  const coverStyle = {
    ...vars,
    maskImage: coverMask.image,
    maskComposite: coverMask.composite,
    WebkitMaskImage: coverMask.image,
    WebkitMaskComposite: coverMask.composite ? 'source-in' : '',
  } as Record<string, string>;

  return (
    <>
      <div class="dot-mask-ring" style={ringStyle} />
      <div class="dot-mask-cover" style={coverStyle} />
    </>
  );
}

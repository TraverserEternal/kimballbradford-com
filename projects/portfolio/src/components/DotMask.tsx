interface DotMaskProps {
  cx?: string;
  cy?: string;
  width?: string;
  height?: string;
  hideRadius?: string;
  shiftRadius?: string;
  filter?: string;
  bgColor?: string;
}

export function DotMask({
  cx = '50%',
  cy = '30%',
  width = '900px',
  height = '600px',
  hideRadius = '30%',
  shiftRadius = '60%',
  filter = 'hue-rotate(60deg) saturate(1.5)',
  bgColor,
}: DotMaskProps) {
  const vars = {
    '--dm-cx': cx,
    '--dm-cy': cy,
    '--dm-w': width,
    '--dm-h': height,
    '--dm-hide': hideRadius,
    '--dm-shift': shiftRadius,
    '--dm-filter': filter,
    ...(bgColor ? { '--dm-bg': bgColor } : {}),
  } as Record<string, string>;

  return (
    <>
      <div class="dot-mask-ring" style={vars} />
      <div class="dot-mask-cover" style={vars} />
    </>
  );
}

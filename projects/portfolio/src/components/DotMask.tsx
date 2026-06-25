interface DotMaskProps {
  cx?: string;
  cy?: string;
  width?: string;
  height?: string;
  hideRadius?: string;
  bgColor?: string;
}

export function DotMask({
  cx = '50%',
  cy = '30%',
  width = '900px',
  height = '600px',
  hideRadius = '30%',
  bgColor,
}: DotMaskProps) {
  const vars = {
    '--dm-cx': cx,
    '--dm-cy': cy,
    '--dm-w': width,
    '--dm-h': height,
    '--dm-hide': hideRadius,
    ...(bgColor ? { '--dm-bg': bgColor } : {}),
  } as Record<string, string>;

  return <div class="dot-mask" style={vars} />;
}

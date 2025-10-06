import React from 'react';

// Minimal Flex JSON renderer for preview purposes (not complete but practical)
// Supports container: bubble | carousel, and basic components: box, text, image, button, separator, icon

const PhoneFrame = ({ children, title = 'LINE', dark = false }) => (
  <div className="w-full flex justify-center">
    <div className="w-full max-w-sm rounded-[36px] border border-gray-300 bg-white shadow-xl overflow-hidden">
      <div className={`px-4 py-2 text-sm ${dark ? 'bg-black text-white' : 'bg-[#06c755] text-white'}`}>{title}</div>
      <div className="bg-gray-100 p-3 min-h-[480px] max-h-[640px] overflow-y-auto">
        {children}
      </div>
      <div className="bg-white border-t border-gray-200 px-3 py-2 text-gray-400 text-sm">訊息輸入列（預覽）</div>
    </div>
  </div>
);

function Text({ node }) {
  const clamp = node.maxLines && node.wrap !== false;
  const baseStyle = {
    color: node.color,
    textAlign: alignToText(node.align),
    fontWeight: node.weight,
    fontSize: sizeToPx(node.size),
    lineHeight: node.lineSpacing,
    fontStyle: node.style === 'italic' ? 'italic' : undefined,
    textDecoration: node.decoration,
    whiteSpace: node.wrap ? 'pre-wrap' : 'nowrap',
    overflow: clamp ? 'hidden' : undefined,
    display: clamp ? '-webkit-box' : undefined,
    WebkitLineClamp: clamp ? node.maxLines : undefined,
    WebkitBoxOrient: clamp ? 'vertical' : undefined,
    alignSelf: gravityToAlignSelf(node.gravity),
    marginTop: spacingToMargin(node.margin),
    flexGrow: flexGrow(node.flex),
    ...positionStyle(node),
  };

  // rich text spans
  const inner = Array.isArray(node.contents) && node.contents.length ? (
    <div style={{ ...baseStyle, display: node.maxLines ? '-webkit-box' : undefined }}>
      {node.contents.map((s, i) => (
        <Span node={s} key={i} />
      ))}
    </div>
  ) : (
    <div style={baseStyle}>{node.text}</div>
  );
  return wrapAction(node, inner);
}

function Image({ node }) {
  const ratio = node.aspectRatio || '1:1';
  const [w, h] = ratio.split(':').map(Number);
  const paddingTop = h && w ? `${(h / w) * 100}%` : undefined;
  const mode = node.aspectMode || 'cover';
  const radius = radiusToPx(node.cornerRadius);
  return (
    wrapAction(
      node,
      <div className="w-full relative overflow-hidden" style={{ paddingTop, borderRadius: radius, marginTop: spacingToMargin(node.margin), backgroundColor: node.backgroundColor, ...positionStyle(node) }}>
        <img src={node.url} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: mode, borderRadius: radius }} />
      </div>
    )
  );
}

function Button({ node }) {
  const primary = node.style === 'primary';
  const secondary = node.style === 'secondary';
  const classes = primary
    ? 'bg-[#06c755] text-white hover:opacity-90'
    : secondary
    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    : 'text-[#06c755] hover:underline';
  const style = {
    backgroundColor: !primary && !secondary && node.color ? node.color : undefined,
    color: !primary && !secondary && node.color ? 'white' : undefined,
    marginTop: spacingToMargin(node.margin),
    alignSelf: gravityToAlignSelf(node.gravity),
    flexGrow: flexGrow(node.flex),
    ...positionStyle(node),
  };
  const el = (
    <button className={`w-full px-4 py-2 rounded-lg text-sm ${classes}`} title={node.action?.uri || node.action?.text} style={style}>
      {node.action?.label || 'Button'}
    </button>
  );
  return wrapAction(node, el);
}

function Separator({ node }) {
  return (
    <div
      className="my-2"
      style={{
        borderTop: '1px solid',
        borderColor: node?.color || 'rgba(0,0,0,0.1)',
        marginTop: spacingToMargin(node?.margin),
        ...positionStyle(node || {}),
      }}
    />
  );
}

function Box({ node }) {
  const dir = node.layout === 'horizontal' ? 'row' : node.layout === 'baseline' ? 'row' : 'column';
  const alignItems = node.layout === 'baseline' ? 'baseline' : alignToAlignItems(node.align);
  const justifyContent = justifyToCss(node.justifyContent);
  const gap = spacingToGap(node.spacing);
  const style = {
    position: 'relative',
    display: 'flex',
    flexDirection: dir,
    alignItems,
    justifyContent,
    gap,
    background: gradientBackground(node) || undefined,
    backgroundColor: !gradientBackground(node) ? node.backgroundColor : undefined,
    borderRadius: radiusToPx(node.cornerRadius),
    borderWidth: node.borderWidth ? `${node.borderWidth}px` : undefined,
    borderStyle: node.borderWidth ? 'solid' : undefined,
    borderColor: node.borderColor,
    ...(node.paddingAll != null
      ? { padding: px(node.paddingAll) }
      : {
          paddingTop: px(node.paddingTop),
          paddingBottom: px(node.paddingBottom),
          paddingLeft: px(node.paddingStart),
          paddingRight: px(node.paddingEnd),
        }),
    marginTop: spacingToMargin(node.margin),
    flexGrow: flexGrow(node.flex),
    width: px(node.width) || undefined,
    height: px(node.height) || undefined,
    ...positionStyle(node),
  };
  const box = (
    <div style={style}>
      {Array.isArray(node.contents) && node.contents.map((c, i) => (
        <Component node={c} key={i} />
      ))}
    </div>
  );
  return wrapAction(node, box);
}
function Icon({ node }) {
  const size = sizeToPx(node.size) || '16px';
  return <img src={node.url} alt="" style={{ width: size, height: size, marginTop: spacingToMargin(node.margin), ...positionStyle(node) }} />;
}

function Component({ node }) {
  if (!node) return null;
  switch (node.type) {
    case 'box':
      return <Box node={node} />;
    case 'text':
      return <Text node={node} />;
    case 'image':
      return <Image node={node} />;
    case 'button':
      return <Button node={node} />;
    case 'separator':
      return <Separator node={node} />;
    case 'icon':
      return <Icon node={node} />;
    case 'spacer':
      return <Spacer node={node} />;
    case 'filler':
      return <Filler />;
    case 'span':
      return <Span node={node} />;
    default:
      return null;
  }
}

function Bubble({ json }) {
  const { header, hero, body, footer, styles } = json || {};
  return (
    <div className="w-full bg-white rounded-2xl shadow p-3 space-y-3" style={{ borderRadius: radiusToPx(json?.cornerRadius), position: 'relative' }}>
      {header && (
        <div className="px-1" style={{ backgroundColor: styles?.header?.backgroundColor, position: 'relative' }}>
          <Component node={header} />
        </div>
      )}
      {hero && (
        <div style={{ position: 'relative' }}>
          <Component node={hero} />
        </div>
      )}
      {body && (
        <div className="px-1" style={{ backgroundColor: styles?.body?.backgroundColor, position: 'relative' }}>
          <Component node={body} />
        </div>
      )}
      {footer && (
        <div className="px-1" style={{ backgroundColor: styles?.footer?.backgroundColor, position: 'relative' }}>
          <Component node={footer} />
        </div>
      )}
    </div>
  );
}

function Carousel({ json }) {
  const contents = Array.isArray(json?.contents) ? json.contents : [];
  return (
    <div className="flex gap-3 overflow-x-auto py-1">
      {contents.map((b, i) => (
        <div key={i} className="min-w-[280px] max-w-[320px]">
          <Bubble json={b} />
        </div>
      ))}
    </div>
  );
}

export default function FlexRenderer({ data, title }) {
  let content = null;
  if (!data || typeof data !== 'object') {
    content = <div className="text-gray-500">尚未提供或解析 Flex JSON</div>;
  } else if (data.type === 'bubble') {
    content = <Bubble json={data} />;
  } else if (data.type === 'carousel') {
    content = <Carousel json={data} />;
  } else {
    content = <div className="text-red-600 text-sm">不支援的 container type：{String(data.type)}</div>;
  }
  return <PhoneFrame title={title}>{content}</PhoneFrame>;
}

// helpers
function sizeToPx(size) {
  if (!size) return undefined;
  const map = { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px', xxl: '24px', '3xl': '28px' };
  if (map[size]) return map[size];
  if (typeof size === 'number') return `${size}px`;
  return size; // e.g., '20px'
}

function spacingToGap(s) {
  const map = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
  const v = map[s];
  const n = v == null ? 8 : v;
  return `${n}px`;
}

function spacingToMargin(s) {
  const map = { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, xxl: 24 };
  const v = map[s];
  return v != null ? `${v}px` : undefined;
}

function px(v) {
  if (!v && v !== 0) return undefined;
  if (typeof v === 'number') return `${v}px`;
  return v; // already unit
}

function paddingAll(node) {
  if (node.paddingAll != null) return px(node.paddingAll);
  return undefined;
}

function radiusToPx(v) {
  if (!v && v !== 0) return undefined;
  if (typeof v === 'number') return `${v}px`;
  return v;
}

function flexGrow(v) {
  if (v == null) return undefined;
  if (typeof v === 'number') return v;
  return v ? 1 : 0;
}

function alignToText(a) {
  if (!a) return undefined;
  return a === 'start' ? 'left' : a === 'end' ? 'right' : a;
}

function alignToAlignItems(a) {
  switch (a) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    case 'center':
      return 'center';
    default:
      return undefined;
  }
}

function justifyToCss(j) {
  switch (j) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    case 'center':
      return 'center';
    case 'space-between':
      return 'space-between';
    case 'space-around':
      return 'space-around';
    case 'space-evenly':
      return 'space-evenly';
    default:
      return undefined;
  }
}

function positionStyle(node) {
  if (!node || !node.position) return {};
  const style = { position: node.position };
  if (node.offsetTop != null) style.top = px(node.offsetTop);
  if (node.offsetBottom != null) style.bottom = px(node.offsetBottom);
  if (node.offsetStart != null) style.left = px(node.offsetStart);
  if (node.offsetEnd != null) style.right = px(node.offsetEnd);
  if (node.offsetX != null) style.left = px(node.offsetX);
  if (node.offsetY != null) style.top = px(node.offsetY);
  return style;
}

function Spacer({ node }) {
  const map = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
  const size = map[node?.size] ?? 8;
  return <div style={{ height: `${size}px`, width: '100%', marginTop: spacingToMargin(node?.margin) }} />;
}

function Filler() {
  return <div style={{ flex: 1 }} />;
}

function Span({ node }) {
  const style = {
    color: node.color,
    fontWeight: node.weight,
    fontStyle: node.style === 'italic' ? 'italic' : undefined,
    textDecoration: node.decoration,
    fontSize: sizeToPx(node.size),
  };
  return <span style={style}>{node.text}</span>;
}

function gravityToAlignSelf(g) {
  switch (g) {
    case 'start':
      return 'flex-start';
    case 'end':
      return 'flex-end';
    case 'center':
      return 'center';
    default:
      return undefined;
  }
}

function gradientBackground(node) {
  const bg = node?.background;
  if (!bg || bg.type !== 'linearGradient') return null;
  const angle = bg.angle || '0deg';
  const colors = [bg.startColor, bg.centerColor, bg.endColor].filter(Boolean);
  if (!colors.length) return null;
  return `linear-gradient(${angle}, ${colors.join(', ')})`;
}

function wrapAction(node, element) {
  const action = node?.action;
  if (!action) return element;
  const title = action.uri || action.text || action.data || 'action';
  if (action.type === 'uri' && action.uri) {
    return (
      <a href={action.uri} target="_blank" rel="noreferrer" style={{ cursor: 'pointer', textDecoration: 'none' }} title={title}>
        {element}
      </a>
    );
  }
  return (
    <div role="button" style={{ cursor: 'pointer' }} title={title}>
      {element}
    </div>
  );
}

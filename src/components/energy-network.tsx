import type { SVGProps } from "react";

export function BrandGlyph({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false">
    <path d="M8 8V32M8 9H24M8 20H19M8 31H24" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
    <path d="M24 9H32V20H19M24 31H32V20" stroke="#dd936f" strokeWidth="2" strokeLinecap="square"/>
    <rect x="29.5" y="17.5" width="5" height="5" fill="#dd936f"/>
  </svg>;
}

export function EnergyNetwork(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 560 430" role="img" aria-labelledby="energy-title energy-desc" {...props}>
      <title id="energy-title">Mreža oblasti EEPSI katedre</title>
      <desc id="energy-desc">Shematski spoj elektroenergetskih sistema, softvera, podataka i primene.</desc>
      <g fill="none" stroke="#77988d" strokeWidth="1.1" opacity=".78">
        <path d="M64 80H176V146H284V90H475"/>
        <path d="M64 80V280H170V346H475"/>
        <path d="M284 146V262H398V346"/>
        <path d="M176 146V264H284"/>
        <path d="M398 90V190H475"/>
        <path d="M64 280H64V347H112"/>
      </g>
      <g fill="none" stroke="#d98a63" strokeWidth="2.5" strokeLinecap="square">
        <path d="M64 80H176V146H284"/>
        <path d="M284 146V262H398V346H475"/>
        <path d="M284 146V90H475"/>
      </g>
      <g fill="#f2eee3" stroke="#d98a63" strokeWidth="2">
        <rect x="45" y="61" width="38" height="38" fill="#19363a"/>
        <rect x="265" y="127" width="38" height="38" fill="#19363a"/>
        <rect x="456" y="71" width="38" height="38" fill="#19363a"/>
        <rect x="456" y="327" width="38" height="38" fill="#19363a"/>
      </g>
      <g fill="#d98a63">
        <rect x="58" y="74" width="12" height="12"/><rect x="278" y="140" width="12" height="12"/>
        <rect x="469" y="84" width="12" height="12"/><rect x="469" y="340" width="12" height="12"/>
      </g>
      <g fill="#e8eae2" fontFamily="ui-monospace, Consolas, monospace" fontSize="13" fontWeight="600" letterSpacing="1.2">
        <text x="46" y="124">01 / ENERGETIKA</text>
        <text x="214" y="201">02 / SOFTVER</text>
        <text x="398" y="57">03 / PODACI</text>
        <text x="368" y="391">04 / PRIMENA</text>
      </g>
      <g fill="#8faea2" fontFamily="ui-monospace, Consolas, monospace" fontSize="10" letterSpacing=".8">
        <text x="46" y="47">SISTEM</text><text x="213" y="216">UPRAVLJANJE</text><text x="398" y="43">ANALIZA</text><text x="368" y="408">INŽENJERSTVO</text>
      </g>
      <g fill="#d98a63">
        <circle cx="176" cy="146" r="4"/><circle cx="284" cy="90" r="4"/><circle cx="398" cy="262" r="4"/>
        <circle cx="170" cy="346" r="4"/><circle cx="64" cy="280" r="4"/>
      </g>
      <path d="M30 395H160M30 405H86" stroke="#77988d" strokeWidth="1"/>
    </svg>
  );
}

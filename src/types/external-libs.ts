// GSAP animation types
export interface GSAPAnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | object;
  opacity?: number;
  y?: number | string;
  x?: number | string;
  scale?: number;
  rotation?: number;
  transformOrigin?: string;
  onComplete?: () => void;
  onStart?: () => void;
}

// Leaflet types
export interface LeafletMapConfig {
  center: [numbernumber];
  zoom: number;
  scrollWheelZoom?: boolean;
  maxZoom?: number;
  minZoom?: number;
  layers?: any[];
  attributionControl?: boolean;
  zoomControl?: boolean;
}

export interface LeafletMarkerConfig {
  position: [numbernumber];
  icon?: any;
  title?: string;
  alt?: string;
  opacity?: number;
  draggable?: boolean;
}

export interface LeafletPopupConfig {
  content: string | HTMLElement;
  className?: string;
  maxWidth?: number;
  minWidth?: number;
  autoPan?: boolean;
  closeButton?: boolean;
  closeOnClick?: boolean;
  closeOnEscapeKey?: boolean;
}

export interface LeafletIconConfig {
  iconUrl: string;
  iconSize?: [numbernumber];
  iconAnchor?: [numbernumber];
  popupAnchor?: [numbernumber];
  shadowUrl?: string;
  shadowSize?: [numbernumber];
  shadowAnchor?: [numbernumber];
  className?: string;
}
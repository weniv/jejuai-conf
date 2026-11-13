"use client";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import styles from "./VenueMap.module.scss";

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY ?? "";

interface Venue {
  name: string;
  room: string;
  address: string;
  mapUrl: string;
  lat: number;
  lng: number;
}

// 카카오 키가 없거나 막혔을 때는 키 없이 쓰는 구글 지도 임베드로 대신한다
const Fallback = ({ venue }: { venue: Venue }) => (
  <iframe
    className={styles.embed}
    title={`${venue.name} 위치 지도`}
    src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&z=17&hl=ko&output=embed`}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
);

const KakaoMap = ({ venue }: { venue: Venue }) => {
  const [isLoading, error] = useKakaoLoader({ appkey: APP_KEY });
  const center = { lat: venue.lat, lng: venue.lng };

  if (error) return <Fallback venue={venue} />;

  // 스크롤이 지도에 붙잡히지 않도록 움직임은 막고, 누르면 카카오맵으로 연다
  return (
    <a
      className={styles.map}
      href={venue.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`카카오맵에서 ${venue.name} 위치 보기`}
    >
      {!isLoading && (
        <Map
          center={center}
          level={3}
          draggable={false}
          zoomable={false}
          disableDoubleClickZoom
          style={{ width: "100%", height: "100%" }}
        >
          <MapMarker
            position={center}
            image={{ src: "/images/mark.webp", size: { width: 45, height: 60 } }}
          />
        </Map>
      )}
    </a>
  );
};

export const VenueMap = ({ venue }: { venue: Venue }) =>
  APP_KEY ? <KakaoMap venue={venue} /> : <Fallback venue={venue} />;

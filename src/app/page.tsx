import data from "@/data/data.json";
import styles from "./page.module.scss";
import { Stage } from "@/components/stage/Stage";
import { Dday, Replay } from "@/components/stage/Controls";
import { Faq } from "@/components/Faq";
import { Header } from "@/components/Header";
import { RegisterButton } from "@/components/RegisterButton";
import { VenueMap } from "@/components/VenueMap";
import { Program } from "@/components/Program";
import { Partners } from "@/components/Partners";

const { hero, about, program, location, partners, faq, prompts, registration } = data;

const SITE = "https://jejuai.kr";

// 구글 검색에 날짜·장소가 붙은 행사 카드로 보이도록 행사 정보를 함께 싣는다
const eventData = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "2026 제주 AI 컨퍼런스",
  description: `${about.lead.replace(/\u00a0/g, " ")} ${about.body}`,
  startDate: data.eventTime.start,
  endDate: data.eventTime.end,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  inLanguage: "ko-KR",
  url: SITE,
  image: [`${SITE}/images/og-2026.jpg`],
  location: {
    "@type": "Place",
    name: `${location.name} ${location.room}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "중앙로 217",
      addressLocality: "제주시",
      addressRegion: "제주특별자치도",
      addressCountry: "KR",
    },
    geo: { "@type": "GeoCoordinates", latitude: location.lat, longitude: location.lng },
  },
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "KRW",
    url: registration.url || SITE,
    availability: registration.url
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder",
  },
};

const PromptLine = ({ text }: { text: string }) => (
  <p className={styles.promptLine}>
    <span>&gt;</span>
    <span data-prompt-line="">{text}</span>
    <i />
  </p>
);

export default function Home() {
  return (
    <div className={styles.site}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
      />
      <Stage opening={prompts.opening} />

      <Header registration={registration} />

      <main className={styles.main}>
        <section id="top" className={styles.hero} data-prompt={prompts.opening}>
          <p className={styles.eyebrow} data-build="상태">
            {hero.eyebrow}
            <Dday date={data.eventStart} />
          </p>
          <h1 data-build="행사명">
            {hero.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.dates} data-build="날짜">
            {hero.dates.map(({ date, day }, i) => (
              <span key={date}>
                {i > 0 && <i aria-hidden="true" />}
                {date} <small>{day}</small>
              </span>
            ))}
          </p>
          <div className={styles.detail} data-build="일시·장소">
            <dl>
              <div>
                <dt>행사 일시</dt>
                <dd>{hero.detail}</dd>
              </div>
              <div>
                <dt>장소</dt>
                <dd>{hero.place}</dd>
              </div>
            </dl>
          </div>
          <div className={styles.heroCta} data-build="신청">
            <RegisterButton registration={registration} size="large" />
          </div>
        </section>

        <section
          id="about"
          className={styles.section}
          data-prompt={prompts.about}
        >
          <PromptLine text={prompts.about} />
          <h2 data-build="제목">행사 소개</h2>
          <p className={styles.lead} data-build="핵심 문구">
            {about.lead}
          </p>
          <p className={styles.body} data-build="설명">
            {about.body}
          </p>
        </section>

        <section
          id="program"
          className={styles.section}
          data-prompt={prompts.program}
        >
          <PromptLine text={prompts.program} />
          <h2 data-build="제목">프로그램 안내</h2>
          {/* 탭을 바꿔도 같은 요소라 한 번 적힌 뒤로는 다시 숨지 않는다 */}
          <div data-build="프로그램">
            <Program {...program} />
          </div>
        </section>

        <section
          id="location"
          className={styles.section}
          data-prompt={prompts.location}
        >
          <PromptLine text={prompts.location} />
          <h2 data-build="제목">찾아오시는 길</h2>
          <p className={styles.lead} data-build="장소">
            {location.name} <span className={styles.nowrap}>{location.room}</span>
          </p>
          <p className={styles.body} data-build="주소">
            {location.address}
          </p>
          <div data-build="지도">
            <VenueMap venue={location} />
          </div>
          <dl className={styles.parking} data-build="주차">
            <dt>주차 안내</dt>
            <dd>{location.parking}</dd>
          </dl>
        </section>

        <section
          id="faq"
          className={styles.section}
          data-prompt={prompts.faq}
        >
          <PromptLine text={prompts.faq} />
          <h2 data-build="제목">FAQ</h2>
          <Faq items={faq} />
        </section>
      </main>

      <footer className={styles.footer}>
        <Partners {...partners} />
        <div className={styles.footerBottom}>
          <p>2026 제주 AI 컨퍼런스</p>
          <div className={styles.footerLinks}>
            <Replay className={styles.replay} />
            <a href="#top">맨 위로 <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

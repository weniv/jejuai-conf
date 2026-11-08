import data from "@/data/data.json";
import styles from "./page.module.scss";
import { Stage } from "@/components/stage/Stage";
import { PointerHighlight } from "@/components/stage/PointerHighlight";
import { Dday, Replay } from "@/components/stage/Controls";
import { Faq } from "@/components/Faq";

const { hero, about, schedule, faq, prompts } = data;

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
      <Stage opening={prompts.opening} />
      <PointerHighlight />
      <Replay className={styles.replay} />

      <header className={styles.header}>
        <a href="#top" data-build="행사명" aria-label="JEJU AI CONFERENCE 2026">
          <span className={styles.brandName}>
            <span className={styles.brandTitle}>JEJU AI</span>{" "}
            <span className={styles.brandSubtitle}>CONFERENCE <em>2026</em></span>
          </span>
        </a>
        <nav data-build="메뉴">
          <a href="#about">소개</a>
          <a href="#schedule">일정</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section id="top" className={styles.hero} data-prompt={prompts.opening}>
          <p className={styles.eyebrow} data-build="상태">
            {hero.eyebrow}
            <em>
              {hero.status} <Dday date={data.eventStart} />
            </em>
          </p>
          <h1 data-build="행사명">
            {hero.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.dates} data-build="날짜">
            {hero.dates}
          </p>
          <div className={styles.detail} data-build="일시·장소">
            <p>{hero.detail}</p>
            <p>{hero.place}</p>
            <p>{hero.note}</p>
          </div>
          <div className={styles.sceneCaption} aria-hidden="true">
            <span>33.361° N · 126.533° E</span>
            <span>HALLASAN, JEJU</span>
          </div>
          <a href="#about" className={styles.scrollHint}>
            <span>SCROLL TO EXPLORE</span><span aria-hidden="true">↓</span>
          </a>
        </section>

        <section
          id="about"
          className={styles.section}
          data-prompt={prompts.about}
          data-section="01"
        >
          <PromptLine text={prompts.about} />
          <h2 data-build="제목">소개</h2>
          <p className={styles.lead} data-build="핵심 문구">
            {about.lead}
          </p>
          <p className={styles.body} data-build="설명">
            {about.body}
          </p>
        </section>

        <section
          id="schedule"
          className={styles.section}
          data-prompt={prompts.schedule}
          data-section="02"
        >
          <PromptLine text={prompts.schedule} />
          <h2 data-build="제목">일정</h2>
          <ol className={styles.schedule}>
            {schedule.map(({ day, date, time, note }) => (
              <li key={day} data-build={day}>
                <strong>{date}</strong>
                <span>{day}</span>
                <span>{time}</span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="faq"
          className={styles.section}
          data-prompt={prompts.faq}
          data-section="03"
        >
          <PromptLine text={prompts.faq} />
          <h2 data-build="제목">FAQ</h2>
          <Faq items={faq} />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>2026 제주 AI 컨퍼런스</p>
        <a href="#top">맨 위로 <span aria-hidden="true">↑</span></a>
      </footer>
    </div>
  );
}

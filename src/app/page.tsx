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
      <Stage opening={prompts.opening} idlePrompts={prompts.idle} />
      <PointerHighlight />
      <Replay className={styles.replay} />

      <header className={styles.header}>
        <a href="#top" data-build="">
          제주 AI 컨퍼런스
        </a>
        <nav data-build="">
          <a href="#about">소개</a>
          <a href="#schedule">일정</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section id="top" className={styles.hero} data-prompt={prompts.opening}>
          <p className={styles.eyebrow} data-build="">
            {hero.eyebrow}
            <em>
              {hero.status} <Dday date={data.eventStart} />
            </em>
          </p>
          <h1 data-build="">
            {hero.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.dates} data-build="">
            {hero.dates}
          </p>
          <div className={styles.detail} data-build="">
            <p>{hero.detail}</p>
            <p>{hero.place}</p>
            <p>{hero.note}</p>
          </div>
        </section>

        <section
          id="about"
          className={styles.section}
          data-prompt={prompts.about.build}
          data-idle={prompts.about.idle.join("|")}
        >
          <PromptLine text={prompts.about.build} />
          <h2 data-build="">소개</h2>
          <p className={styles.lead} data-build="">
            {about.lead}
          </p>
          <p className={styles.body} data-build="">
            {about.body}
          </p>
        </section>

        <section
          id="schedule"
          className={styles.section}
          data-prompt={prompts.schedule.build}
          data-idle={prompts.schedule.idle.join("|")}
        >
          <PromptLine text={prompts.schedule.build} />
          <h2 data-build="">일정</h2>
          <ol className={styles.schedule}>
            {schedule.map(({ day, date, time, note }) => (
              <li key={day} data-build="">
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
          data-prompt={prompts.faq.build}
          data-idle={prompts.faq.idle.join("|")}
        >
          <PromptLine text={prompts.faq.build} />
          <h2 data-build="">FAQ</h2>
          <Faq items={faq} />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>2026 제주 AI 컨퍼런스</p>
      </footer>
    </div>
  );
}

import Intro from "@/components/sections/Intro";
import Faq from "../components/sections/Faq";
import Section from "../components/sections/Section";

import styles from "./page.module.scss";
import data from "@/data/data.json";
import Location from "@/components/sections/Location";
import Info from "@/components/sections/Info";
const MENU = data.menu;

export default function Home() {
  return (
    <>
      <main className="">
        <Section id="section1" className={styles.intro}>
          <Intro chatlist={data.intro} />
        </Section>
        {MENU.map((v, i) => (
          <Section
            key={i}
            id={`section${i + 2}`}
            className={v.pc === "찾아오시는 길" ? styles.location : ""}
          >
            {/* "행사 소개", "프로그램 안내", "찾아오시는 길", "FAQ"} */}
            {v.pc === "행사 소개" && <Info chatlist={data.info} />}
            {v.pc === "프로그램 안내" && <>프로그램 안내</>}
            {v.pc === "찾아오시는 길" && <Location address={data.address} />}
            {v.pc === "FAQ" && <Faq faqlist={data.faq} />}
          </Section>
        ))}
      </main>
    </>
  );
}

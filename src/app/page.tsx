import data from "@/data/data.json";
import { Intro } from "@/components/sections/Intro";
import { Info } from "@/components/sections/Info";
import { Program } from "@/components/sections/Program";
import { ProgramDraft } from "@/components/sections/ProgramDraft";
import { Location } from "@/components/sections/Location";
import { Faq } from "@/components/sections/Faq";
import { Swarm } from "@/components/build/Swarm";
import { PointerHighlight } from "@/components/build/PointerHighlight";
import { Fragment } from "react";
import { chatType, dayType, heroType } from "@/utils/types";

export default function Home() {
  const program = data.program as dayType;

  return (
    <main>
      <Swarm />
      <PointerHighlight />
      <Intro id="section1" data={data.hero as heroType} />
      {data.menu.map((v, i) => (
        <Fragment key={i}>
          {v.pc === "행사 소개" && (
            <Info id={`section${i + 2}`} data={data.info as chatType[]} />
          )}
          {v.pc === "프로그램 안내" &&
            (program.day1.length ? (
              <Program id={`section${i + 2}`} data={program} />
            ) : (
              <ProgramDraft id={`section${i + 2}`} data={data.programDraft} />
            ))}
          {v.pc === "찾아오시는 길" && (
            <Location id={`section${i + 2}`} address={data.address} />
          )}
          {v.pc === "FAQ" && <Faq id={`section${i + 2}`} data={data.faq} />}
        </Fragment>
      ))}
    </main>
  );
}

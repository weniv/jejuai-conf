import data from "@/data/data.json";
import { Intro } from "@/components/sections/Intro";
import { Info } from "@/components/sections/Info";
import { Program } from "@/components/sections/Program";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { Fragment, useState } from "react";

export default function Home() {
  return (
    <main>
      <Intro id="section1" data={data.intro} />
      {data.menu.map((v, i) => (
        <Fragment key={i}>
          {v.pc === "행사 소개" && (
            <Info id={`section${i + 2}`} data={data.info} />
          )}
          {v.pc === "프로그램 안내" && <Program id={`section${i + 2}`} />}
          {v.pc === "찾아오시는 길" && (
            <Location id={`section${i + 2}`} address={data.address} />
          )}
          {v.pc === "FAQ" && <FAQ id={`section${i + 2}`} data={data.faq} />}
        </Fragment>
      ))}
    </main>
  );
}

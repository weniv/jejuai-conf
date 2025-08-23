import Image from "next/image";
import styles from "./page.module.scss";

export default function VSCodeDevDaysPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>VS Code Dev Days - JEJU</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.intro}>
          <p>
            VS Code Dev Days는 전 세계적으로 9월에 동시 개최하는 개발자 행사로, VS Code와 GitHub Copilot을 활용해 
            개발자뿐만 아니라 비개발자도 일정 수준의 애플리케이션을 직접 개발해보는 실습 중심 이벤트입니다.
          </p>
          
          <p>
            이번 핸즈온 워크숍은 GitHub Copilot 활용에 중점을 두어, 실무에 즉시 적용 가능한 역량을 기를 수 있도록 구성했습니다. 
            누구나 참여 가능하며, 아래와 같은 내용을 학습하게 됩니다.
          </p>

          <ul className={styles.learningList}>
            <li><strong>GitHub Copilot 활성화:</strong> VS Code에서 GitHub Copilot을 설치 및 활성화하는 방법</li>
            <li><strong>AI 코딩 프롬프트 작성법:</strong> 효과적인 프롬프트 설계와 MCP(Model Context Protocol) 활용법</li>
            <li><strong>Agent 모드 실습:</strong> GitHub Copilot의 Agent 모드를 활용한 애플리케이션 개발</li>
            <li><strong>언어 마이그레이션:</strong> 익숙하지 않은 언어로도 AI의 도움을 받아 애플리케이션 마이그레이션 수행</li>
          </ul>
        </section>

        <section className={styles.eventInfo}>
          <h2>일시 및 장소</h2>
          <div className={styles.infoBox}>
            <p><strong>일시:</strong> 2025년 10월 11일(토요일), 13시 - 18시</p>
            <p><strong>장소:</strong> 제주창조경제혁신센터(주소: 중앙로 217 3층)</p>
          </div>
        </section>

        <section className={styles.target}>
          <h2>참가 대상</h2>
          <p>본 워크숍은 조직 내에서 GitHub Copilot의 활용 가능성을 모색하고자 하는 다음과 같은 분들을 대상으로 합니다.</p>
          <ul className={styles.targetList}>
            <li>개발자</li>
            <li>기획자</li>
            <li>프로덕트 매니저 등</li>
          </ul>
        </section>

        <section className={styles.schedule}>
          <h2>시간 계획</h2>
          <div className={styles.scheduleTable}>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>13:00 ~ 13:50</span>
              <span className={styles.content}>VS Code에서 GitHub Copilot을 사용하기 위한 필수 테크닉</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>14:00 ~ 14:50</span>
              <span className={styles.content}>GitHub Copilot으로 슈팅게임 만들기(.NET)</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>15:00 ~ 15:50</span>
              <span className={styles.content}>GitHub Copilot 어드벤처(JavaScript)</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>16:00 ~ 16:50</span>
              <span className={styles.content}>Python 프로젝트 업그레이드하기</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.time}>17:00 ~ 17:50</span>
              <span className={styles.content}>아이디어 토론 및 네트워킹</span>
            </div>
          </div>
          <p className={styles.note}>구체적인 내용은 현장 상황에 따라 달라질 수 있습니다.</p>
        </section>

        <section className={styles.preparation}>
          <h2>준비물</h2>
          <p>
            본 워크숍에서는 GitHub Copilot을 실무에 바로 적용할 수 있는 기술을 연습할 수 있는 실습 환경을 제공합니다. 
            참가자는 아래 사항을 반드시 숙지해주시기 바랍니다:
          </p>
          <ul className={styles.preparationList}>
            <li>개인 노트북을 반드시 지참해 주세요. 노트북 미지참 시 행사 참석이 어려우며, 원활한 실습을 위해 Wi-Fi 접속이 가능한 환경이 필요합니다.</li>
            <li>실습에 참여하시려면, GitHub Copilot의 에이전트 모드를 지원하는 최신 버전의 VS Code를 사전에 설치해야 합니다.</li>
            <li>업무용 노트북은 보안 설정으로 인해 실습에 제약이 생길 수 있으므로, 개인 노트북을 지참하세요.</li>
            <li>참가자는 본인의 GitHub Copilot 무료 또는 유료(Pro) 라이선스를 사용하는 것을 원칙으로 합니다. 다만, 예외적으로 임시 체험용 계정을 제한적으로 제공할 수 있습니다.</li>
          </ul>
        </section>

        <section className={styles.speakers}>
          <h2>워크숍 진행</h2>
          <div className={styles.speakerGrid}>
            <div className={styles.speaker}>
              <Image
                src="/ms/유저스틴_Microsoft.png"
                alt="유저스틴"
                width={200}
                height={200}
                className={styles.speakerPhoto}
              />
              <h3>유저스틴</h3>
            </div>
            <div className={styles.speaker}>
              <Image
                src="/ms/이보라_Microsoft_MVP.jpg"
                alt="이보라"
                width={200}
                height={200}
                className={styles.speakerPhoto}
              />
              <h3>이보라</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
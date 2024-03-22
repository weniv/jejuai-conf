import { useEffect, useRef } from "react";

const useIntersectionObservation = (setActiveId, contentsClass) => {
  const contentRef = useRef({});

  useEffect(() => {
    // callback: 관찰하려는 요소가 영역에 들어온 경우 실행
    const callback = (observedContent) => {
      observedContent.forEach((content) => {
        contentRef.current[content.target.id] = content;
      });

      const visibleContent = Object.values(contentRef.current).filter(
        (content) => content.isIntersecting
      );

      setActiveId(visibleContent[0]?.target.id);
    };

    /* option
    rootMarign:어느정도의 영역을 관찰할 것인가 px, % 사용가능 
    threshold: 가시성
    */
    const observer = new IntersectionObserver(callback, {
      // rootMargin: "-180px 0px -180px 0px",
      threshold: [0.4, 1],
    });

    const contents = [...document.querySelectorAll(contentsClass)];

    contents.forEach((content) => observer.observe(content));

    return () => observer.disconnect();
  }, [setActiveId]);
};

export default useIntersectionObservation;

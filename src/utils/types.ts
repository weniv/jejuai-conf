export interface chatType {
  ai?: string | chatContentType;
  you?: string;
}

export interface chatContentType {
  string?: string;
  ul?: string[];
  link?: linkType;
}

export interface dayType {
  day1: ProgramType[];
  day2: ProgramType[];
}

export interface ProgramType {
  time: string;
  space: string;
  times: number;
  title: string;
  subtitle?: string;
  speaker: string;
  affiliated: string;
  registration?: {
    url: string;
    description: string;
  };
}

export interface FaqType {
  question: string;
  answer: string | answerType;
}

interface answerType {
  string: string[];
  link: linkType[];
}

interface linkType {
  url: string;
  text: string;
}

interface Props {
  text: string;
  textShadow?: string
  textColor?: string
}

export const Heading1 = ({ text, textShadow, textColor = `text-text` }: Props) => {
  return <h1 className={`${textShadow} first-letter:uppercase font-bold text-2xl my-10 w-fit ${textColor}`}>{text}</h1>;
};

export const Heading2 = ({ text, textShadow, textColor }: Props) => {
  return <h2 className={`${textShadow} first-letter:uppercase font-bold text-xl my-8 w-fit ${textColor}`}>{text}</h2>;
};

export const Heading3 = ({ text, textShadow, textColor }: Props) => {
  return <h3 className={`${textShadow} first-letter:uppercase font-bold text-lg my-6 w-fit ${textColor}`}>{text}</h3>;
};

export const Heading4 = ({ text, textShadow, textColor }: Props) => {
  return <h4 className={`${textShadow} first-letter:uppercase font-bold my-4 w-fit ${textColor}`}>{text}</h4>;
};

interface Props {
  text: string;
  textShadow?: string
}

export const Heading1 = ({ text, textShadow }: Props) => {
  return <h1 className={`${textShadow} first-letter:uppercase font-bold text-contrast dark:text-text text-2xl my-10 w-fit`}>{text}</h1>;
};

export const Heading2 = ({ text, textShadow }: Props) => {
  return <h2 className={`${textShadow} first-letter:uppercase font-bold text-contrast dark:text-text text-xl my-8 w-fit`}>{text}</h2>;
};

export const Heading3 = ({ text, textShadow }: Props) => {
  return <h3 className={`${textShadow} first-letter:uppercase font-bold text-lg my-6 w-fit`}>{text}</h3>;
};

export const Heading4 = ({ text, textShadow }: Props) => {
  return <h4 className={`${textShadow} first-letter:uppercase font-bold text-contrast dark:text-text my-4 w-fit`}>{text}</h4>;
};

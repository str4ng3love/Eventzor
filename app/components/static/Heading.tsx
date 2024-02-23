interface Props {
  text: string;
  textShadow?: string;
  textColor?: string;
}

export const Heading1 = ({
  text,
  textShadow,
  textColor = `text-text`,
}: Props) => {
  return (
    <h1
      className={`${textShadow} my-10 w-fit text-2xl font-bold first-letter:uppercase ${textColor}`}
    >
      {text}
    </h1>
  );
};

export const Heading2 = ({ text, textShadow, textColor }: Props) => {
  return (
    <h2
      className={`${textShadow} my-8 w-fit text-xl font-bold first-letter:uppercase ${textColor}`}
    >
      {text}
    </h2>
  );
};

export const Heading3 = ({ text, textShadow, textColor }: Props) => {
  return (
    <h3
      className={`${textShadow} my-6 w-fit text-lg font-bold first-letter:uppercase ${textColor}`}
    >
      {text}
    </h3>
  );
};

export const Heading4 = ({ text, textShadow, textColor }: Props) => {
  return (
    <h4
      className={`${textShadow} my-4 w-fit font-bold first-letter:uppercase ${textColor}`}
    >
      {text}
    </h4>
  );
};

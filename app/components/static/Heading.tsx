interface Props {
  text: string;
}

export const Heading1 = ({ text }: Props) => {
  return <h1 className="first-letter:uppercase font-bold text-2xl my-10">{text}</h1>;
};

export const Heading2 = ({ text }: Props) => {
  return <h2 className="first-letter:uppercase font-bold text-xl my-8">{text}</h2>;
};

export const Heading3 = ({ text }: Props) => {
  return <h3 className="first-letter:uppercase font-bold text-lg my-6">{text}</h3>;
};

export const Heading4 = ({ text }: Props) => {
  return <h4 className="first-letter:uppercase font-bold my-4">{text}</h4>;
};

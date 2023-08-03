interface Props {
  show: boolean;
  error: boolean;
  message: string;
  onAnimEnd: () => void;
}
export interface NotificationObj {
  show: boolean;
  message: string;
  error: boolean;
}

const Notification = ({ show, error, message, onAnimEnd }: Props) => {
  return (
    <>
      {show ? (
        <>
          {error ? (
            <div
              onAnimationEnd={() => onAnimEnd()}
              className="text-center flex justify-center items-center bg-secondary rounded-md animate-growAndShrink font-semibold"
            >
              {message}
            </div>
          ) : (
            <div
              onAnimationEnd={() => onAnimEnd()}
              className="text-center flex justify-center items-center bg-link rounded-md animate-growAndShrink font-semibold"
            >
              {message}
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Notification;

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
// todo : improve on styles
const Notification = ({ show, error, message, onAnimEnd }: Props) => {
  return (
    <>
      {show ? (
        <>
          {error ? (
            <div
              onAnimationEnd={() => onAnimEnd()}
              className="shadow-md shadow-black absolute min-w-[400px] text-center flex justify-center items-center bg-secondary rounded-md animate-growAndShrink font-semibold"
            >
              {message}
            </div>
          ) : (
            <div
              onAnimationEnd={() => onAnimEnd()}
              className="shadow-md shadow-black absolute min-w-[400px] left-[50%] translate-x-[-50%] text-center flex justify-center items-center bg-link rounded-md animate-growAndShrink font-semibold"
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

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
              className="absolute left-[50%] top-0 flex min-w-[400px] translate-x-[-50%] translate-y-[100%] animate-growAndShrink items-center justify-center rounded-md bg-secondary px-2 text-center font-semibold shadow-md shadow-black"
            >
              {message}
            </div>
          ) : (
            <div
              onAnimationEnd={() => onAnimEnd()}
              className="absolute left-[50%] top-0 flex min-w-[400px] translate-x-[-50%] translate-y-[100%] animate-growAndShrink items-center justify-center rounded-md bg-link px-2 text-center font-semibold shadow-md shadow-black"
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

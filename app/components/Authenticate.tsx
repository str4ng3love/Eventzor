import LoginForm from "./dynamic/LoginForm";
import RegisterForm from "./dynamic/RegisterForm";

const Authenticate = () => {
  return (
    <div className="flex justify-around gap-4 p-4">
      <RegisterForm />
      <LoginForm />
    </div>
  );
};

export default Authenticate;

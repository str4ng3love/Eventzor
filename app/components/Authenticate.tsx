
import LoginForm from "./dynamic/LoginForm";
import RegisterForm from "./dynamic/RegisterForm";


const Authenticate = () => {

  return (
    <div className="p-4 flex justify-around gap-4">
   <RegisterForm /> 
   <LoginForm />
    </div>
  );
};

export default Authenticate;

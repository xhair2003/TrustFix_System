import "../../style/style.scss";
import React from "react";
import RegisterForm from "../../component/users/register/RegisterForm";
import AuthenticationForm from "../../component/users/register/AuthenticationForm";

const Register = () => {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleRegisterSuccess = (registeredEmail) => {
    setEmail(registeredEmail);
    setIsRegistered(true);
  };

  return (
    <div className="login-container">
      {isRegistered ? (
        <AuthenticationForm email={email} />
      ) : (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
};

export default Register;
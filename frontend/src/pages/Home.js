import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const workplaceType = localStorage.getItem("workplaceType");

  useEffect(() => {
    if (role === "donor" || workplaceType === "BloodBank") {
      navigate("/donations");
    } else if (workplaceType === "Hospital") {
      navigate("/bloodbanks");
    }else if(role === "superadmin"){
      navigate('/superadmin/bloodbanks')
    } else {
      navigate("/donor/login");
    }
  }, []);

  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
      <p className="mt-2">Redirecting...</p>
    </div>
  );
};

export default Home;

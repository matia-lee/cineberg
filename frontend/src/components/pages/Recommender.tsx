import { useState, useEffect } from "react";

const Recommender = () => {
  const [test, setTest] = useState<any>("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/recommender")
      .then((response) => response.json())
      .then((response) => setTest(response))
      .catch((error) => `Error grabbing recommendation: ${error}`);
  }, []);
  return (
    <div className="pt-16">
      <div className="text-white">{test.message}</div>
    </div>
  );
};

export default Recommender;

import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

import "../css/common.css";

function Creativepanels() {
  const location = useLocation();

  const state = location.state || {};

  const dealerIds = state.dealerIds || [];

  const preview = state.preview || "";

  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    if (dealerIds.length === 0) {
      console.log("No dealer ids");

      return;
    }

    Promise.all(
      dealerIds.map((id) =>
        fetch(`http://127.0.0.1:5000/dealer/${id}`).then((res) => res.json()),
      ),
    )

      .then((data) => {
        console.log("Dealers:", data);

        setDealers(data);
      })

      .catch((err) => console.error(err));
  }, [dealerIds]);

  return (
    <div className="preview-page">
      <h2>Creative Preview</h2>

      {dealers.length === 0 && <p>Loading...</p>}

      <div className="creative-grid">
        {dealers.map((dealer) => (
          <div key={dealer._id} className="creative">
            <img src={preview || "/bg.jpg"} className="bg" />

            {dealer.logo_url && <img src={dealer.logo_url} className="logo" />}

            <div className="top-text">from anywhere,</div>

            <div className="bottom-banner">
              <h2>{dealer.name}</h2>

              <p>
                {dealer.location}

                {" | "}

                {dealer.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Creativepanels;

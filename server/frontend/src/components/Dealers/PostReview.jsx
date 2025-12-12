import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();
  const root_url = window.location.origin;

  // ✅ use trailing slash for Django POST route
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const review_url = `${root_url}/djangoapp/add_review/`;
  const carmodels_url = `${root_url}/djangoapp/get_cars`;

  const postreview = async () => {
    let name = `${sessionStorage.getItem("firstname")} ${sessionStorage.getItem("lastname")}`;
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const payload = {
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    };

    console.log("Posting review:", payload);

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `${root_url}/dealer/${id}`;
    } else {
      alert("Error posting review: " + (json.message || "Unknown error"));
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealer(Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    setCarmodels(Array.from(retobj.CarModels));
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea cols="50" rows="7" onChange={(e) => setReview(e.target.value)}></textarea>
        <div className="input_field">
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="input_field">
          Car Make
          <select onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, idx) => (
              <option key={idx} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className="input_field">
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>
        <div>
          <button className="postreview" onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
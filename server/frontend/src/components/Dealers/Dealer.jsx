import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";   // spinner
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postReview, setPostReview] = useState(<></>);

  const { id } = useParams();
  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}/djangoapp/reviews/dealer/${id}`;
  const post_review = `${root_url}/postreview/${id}`;

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealer(Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer);
    }
  };

  const get_reviews = async () => {
    const res = await fetch(reviews_url);
    const retobj = await res.json();
    if (retobj.status === 200) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, [id]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {postReview}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.state}, Zip - {dealer.zip}
        </h4>
        {/* ✅ Address line added here */}
        <p>Address: {dealer.address}</p>
      </div>
      <div className="reviews_panel">
        {loading ? (
          <ClipLoader color="grey" size={50} />
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, idx) => (
            <div className="review_panel" key={idx}>
              <img
                src={
                  review.sentiment === "positive"
                    ? positive_icon
                    : review.sentiment === "negative"
                    ? negative_icon
                    : neutral_icon
                }
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;

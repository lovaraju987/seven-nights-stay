
import React from "react";
import { useParams } from "react-router-dom";

const QRStorefront = () => {
  const { hostelId } = useParams();
  
  return (
    <div>
      <h1>QR Storefront for Hostel {hostelId}</h1>
      <p>This page will be implemented in future updates.</p>
    </div>
  );
};

export default QRStorefront;

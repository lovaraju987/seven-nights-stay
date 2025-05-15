
import React from "react";
import { useParams } from "react-router-dom";

const ManageRooms = () => {
  const { hostelId } = useParams();
  
  return (
    <div>
      <h1>Manage Rooms for Hostel {hostelId}</h1>
      <p>This page will be implemented in future updates.</p>
    </div>
  );
};

export default ManageRooms;

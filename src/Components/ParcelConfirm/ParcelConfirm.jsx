import React from "react";
import { useLocation, useNavigate } from "react-router";

const ParcelConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p className="text-center mt-10">No data found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-purple-600">
          Parcel Summary
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><strong>Type:</strong> {state.parcelType}</p>
          <p><strong>Weight:</strong> {state.weight} kg</p>
          <p><strong>Sender:</strong> {state.senderName}</p>
          <p><strong>Receiver:</strong> {state.receiverName}</p>
          <p><strong>From:</strong> {state.senderDistrict}</p>
          <p><strong>To:</strong> {state.receiverDistrict}</p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xl font-bold text-green-600">
            Total Cost: ৳{state.cost}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="btn btn-primary w-full border mt-4"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ParcelConfirm;
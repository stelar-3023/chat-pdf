"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { isPro: boolean };

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button className="mb-8 mt-2 text-white bg-slate-700" disabled={loading} onClick={handleSubscription} variant="outline">
      {props.isPro ? "Manage Subscriptions" : "Upgrade"}
    </Button>
  );
};

export default SubscriptionButton;
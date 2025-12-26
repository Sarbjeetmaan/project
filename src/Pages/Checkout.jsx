import React, { useState, useContext } from 'react';
import AddressForm from '../Components/Checkout/AddressForm';
import OrderReview from '../Components/Checkout/OrderReview';
import PaymentForm from '../Components/Checkout/PaymentForm';
import CheckoutSummary from '../Components/Checkout/CheckoutSummary';
import { HomeContext } from '../Context/HomeContext';
import './CSS/Checkout.css';

const Checkout = () => {
  const { cart, products } = useContext(HomeContext);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);

  const cartDetails = cart
    .map(ci => {
      const product = products.find(p => p._id === ci.id);
      return product ? { ...product, quantity: ci.quantity } : null;
    })
    .filter(Boolean);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleAddressSubmit = (data) => {
    setAddress(data);
    nextStep();
  };

  return (
    <div className="checkout-layout">
      {/* LEFT PANEL */}
      <div className="checkout-left">
        {step === 1 && <AddressForm onSubmit={handleAddressSubmit} />}
        {step === 2 && (
          <OrderReview
            cartDetails={cartDetails}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <PaymentForm
            address={address}
            cartDetails={cartDetails}
          />
        )}
      </div>

      {/* RIGHT PANEL (ALWAYS VISIBLE) */}
      <div className="checkout-right">
        <CheckoutSummary cartDetails={cartDetails} />
      </div>
    </div>
  );
};

export default Checkout;

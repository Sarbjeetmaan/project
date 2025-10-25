// src/Components/Checkout/AddressForm.jsx
import React, { useState } from 'react';

const AddressForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <h2>Shipping Address</h2>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required/>
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required/>
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} required/>
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} required/>
      <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} required/>
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required/>
      <button type="submit">Next</button>
    </form>
  );
};

export default AddressForm;

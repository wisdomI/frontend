'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Camera, Plus, X, CreditCard, Check, Edit, Trash2 } from 'lucide-react';
import SuccessNotification from '@/components/ui/SuccessNotification';
import Verve from "@/public/images/verve.png"
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal Information');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasCardSaved, setHasCardSaved] = useState(false);
  const [savedCard, setSavedCard] = useState<{
    cardNumber: string;
    cardType: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    firstName: 'Daniel',
    lastName: 'Anthony',
    email: 'danielanthony@example.com',
    phoneNumber: '+Phone number',
    dateOfBirth: 'DD/MM/YYYY',
    bio: 'Type here',
    countryOfResidence: 'Nigeria',
    city: 'Lagos',
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveCard = () => {
    const maskedCardNumber = cardData.cardNumber.replace(/\d(?=\d{4})/g, '*');
    setSavedCard({
      cardNumber: maskedCardNumber,
      cardType: 'VISA',
    });
    setHasCardSaved(true);
    setShowAddCardModal(false);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    setCardData({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    });
  };

  const handleEditCard = () => {
    setShowAddCardModal(true);
  };

  const handleDeleteCard = () => {
    setHasCardSaved(false);
    setSavedCard(null);
    setCardData({
      cardNumber: '',
      expirationDate: '',
      cvv: '',
    });
  };

  const handleSaveProfile = () => {
    setShowSuccessModal(true);
  };

  const tabs = ['Personal Information', 'Payment Details'];

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold font-heading text-gray-900 mb-4">Profile Settings</h1>
      <div className="max-w-4xl">
        {/* Tab Navigation */}
        <div className="bg-event-blue rounded-lg p-1 mb-8 inline-flex w-full max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab ? 'text-white border-white shadow-sm' : 'text-white hover:text-blue-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Form */}
        {activeTab === 'Personal Information' && (
          <div className="bg-gray-50 border-gray-200 border rounded-2xl p-8 shadow-sm">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="/images/Ellipse 229.png"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6">
  {/* First Name */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      First Name
    </label>
    <input
      type="text"
      value={formData.firstName}
      onChange={(e) => handleInputChange('firstName', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      placeholder="Daniel"
    />
  </div>

  {/* Date of Birth */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      Date of Birth
    </label>
    <div className="relative">
      <input
        type="text"
        value={formData.dateOfBirth}
        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
        placeholder="DD/MM/YYYY"
      />
      <Calendar
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
        size={20}
      />
    </div>
  </div>

  {/* Last Name */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      Last Name
    </label>
    <input
      type="text"
      value={formData.lastName}
      onChange={(e) => handleInputChange('lastName', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      placeholder="Anthony"
    />
  </div>

  {/* Bio (spanning 2 rows) */}
  <div className="row-span-2">
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      Bio
    </label>
    <textarea
      value={formData.bio}
      onChange={(e) => handleInputChange('bio', e.target.value)}
      className="w-full h-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      placeholder="Type here"
    />
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      Email
    </label>
    <input
      type="email"
      value={formData.email}
      onChange={(e) => handleInputChange('email', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      placeholder="danielanthony@example.com"
    />
  </div>

  {/* Country of Residence */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      Country of Residence
    </label>
    <select
      value={formData.countryOfResidence}
      onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
    >
      <option value="Nigeria">Nigeria</option>
      <option value="Ghana">Ghana</option>
      <option value="Kenya">Kenya</option>
      <option value="South Africa">South Africa</option>
    </select>
  </div>

  {/* Phone Number */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2 mt-2">
      Phone Number
    </label>
    <div className="flex">
      <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
        <span className="text-sm">🇳🇬</span>
      </div>
      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        placeholder="+Phone number"
      />
    </div>
  </div>

  {/* City */}
  <div>
    <label className="block text-sm font-semibold font-heading text-gray-700 mb-2">
      City
    </label>
    <select
      value={formData.city}
      onChange={(e) => handleInputChange('city', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
    >
      <option value="Lagos">Lagos</option>
      <option value="Abuja">Abuja</option>
      <option value="Port Harcourt">Port Harcourt</option>
      <option value="Kano">Kano</option>
    </select>
  </div>
</div>


            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSaveProfile}
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Payment Details Tab */}
        {activeTab === 'Payment Details' && (
          <div className="bg-white rounded-2xl border  border-gray-100 p-8 shadow-sm">
            <div className="w-full">
              <h2 className="text-xl font-semibold font-heading  text-gray-900 mb-2">Add Payment Details</h2>
              <p className="text-gray-600 mb-8 fon-sans ">Save your debit card for faster checkout</p>

              {/* Local Bank Details Section */}
              <div className="mb-6 w-full bg-gray-50 border-gray-300 border p-6 rounded-lg">
                <div className="flex items-center justify-between  mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold font-heading text-event-blue">Local Bank Details</h3>
                  </div>

                  {/* Saved Card Display */}
                  {hasCardSaved && savedCard && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold text-lg">
                        <svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9333 1.95312H19.0369V16.3138H10.9333V1.95312Z" fill="#FF5F00"/>
<path d="M11.4479 9.134C11.4479 6.21624 12.8371 3.62822 14.9722 1.95361C13.4031 0.735769 11.4223 0 9.26133 0C4.14176 0 0 4.08487 0 9.134C0 14.1831 4.14176 18.268 9.26121 18.268C11.4221 18.268 13.403 17.5322 14.9722 16.3143C12.8371 14.6651 11.4479 12.0518 11.4479 9.134Z" fill="#EB001B"/>
<path d="M29.9703 9.134C29.9703 14.183 25.8285 18.268 20.7091 18.268C18.5481 18.268 16.5673 17.5322 14.998 16.3143C17.159 14.6398 18.5225 12.0518 18.5225 9.134C18.5225 6.21624 17.1332 3.62822 14.998 1.95361C16.5672 0.735769 18.5481 0 20.7091 0C25.8285 0 29.9703 4.1103 29.9703 9.134Z" fill="#F79E1B"/>
</svg>
</span>
                        <span className="text-gray-600 font-sans ">{savedCard.cardNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditCard}
                          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={handleDeleteCard}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                   
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1834 1.26943C12.0742 3.09493 10.2897 4.83268 8.65594 7.09993C7.93544 8.09993 7.13419 9.27693 6.61044 10.3882C6.31144 10.9774 5.77244 11.8982 5.58869 12.7834C4.58369 11.8484 3.50419 10.7872 2.39969 9.95593C1.61244 9.36368 -0.655056 10.5712 0.267944 11.2657C1.92219 12.5099 3.29794 14.0597 4.90694 15.3594C5.57994 15.9024 7.07144 14.7232 7.42194 14.2284C8.57244 12.5984 8.72969 10.6059 9.56819 8.82793C10.8484 6.10868 13.1189 3.87493 15.3607 1.93518C16.8459 0.54993 15.3119 0.29443 14.1857 1.26943" fill="#37B34A"/>
</svg>
                    <span className='font-sans font-normal'>Card information is secure and uncompromised</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1834 1.26943C12.0742 3.09493 10.2897 4.83268 8.65594 7.09993C7.93544 8.09993 7.13419 9.27693 6.61044 10.3882C6.31144 10.9774 5.77244 11.8982 5.58869 12.7834C4.58369 11.8484 3.50419 10.7872 2.39969 9.95593C1.61244 9.36368 -0.655056 10.5712 0.267944 11.2657C1.92219 12.5099 3.29794 14.0597 4.90694 15.3594C5.57994 15.9024 7.07144 14.7232 7.42194 14.2284C8.57244 12.5984 8.72969 10.6059 9.56819 8.82793C10.8484 6.10868 13.1189 3.87493 15.3607 1.93518C16.8459 0.54993 15.3119 0.29443 14.1857 1.26943" fill="#37B34A"/>
</svg>
                    <span className='font-sans font-normal'>All data is encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                   
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1834 1.26943C12.0742 3.09493 10.2897 4.83268 8.65594 7.09993C7.93544 8.09993 7.13419 9.27693 6.61044 10.3882C6.31144 10.9774 5.77244 11.8982 5.58869 12.7834C4.58369 11.8484 3.50419 10.7872 2.39969 9.95593C1.61244 9.36368 -0.655056 10.5712 0.267944 11.2657C1.92219 12.5099 3.29794 14.0597 4.90694 15.3594C5.57994 15.9024 7.07144 14.7232 7.42194 14.2284C8.57244 12.5984 8.72969 10.6059 9.56819 8.82793C10.8484 6.10868 13.1189 3.87493 15.3607 1.93518C16.8459 0.54993 15.3119 0.29443 14.1857 1.26943" fill="#37B34A"/>
</svg>
                    <span className='font-sans font-normal'>EventHub never sells your card information</span>
                  </div>
                </div>

                {/* Payment Method Icons */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-5  rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
<svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9333 1.95312H19.0369V16.3138H10.9333V1.95312Z" fill="#FF5F00"/>
<path d="M11.4479 9.134C11.4479 6.21624 12.8371 3.62822 14.9722 1.95361C13.4031 0.735769 11.4223 0 9.26133 0C4.14176 0 0 4.08487 0 9.134C0 14.1831 4.14176 18.268 9.26121 18.268C11.4221 18.268 13.403 17.5322 14.9722 16.3143C12.8371 14.6651 11.4479 12.0518 11.4479 9.134Z" fill="#EB001B"/>
<path d="M29.9703 9.134C29.9703 14.183 25.8285 18.268 20.7091 18.268C18.5481 18.268 16.5673 17.5322 14.998 16.3143C17.159 14.6398 18.5225 12.0518 18.5225 9.134C18.5225 6.21624 17.1332 3.62822 14.998 1.95361C16.5672 0.735769 18.5481 0 20.7091 0C25.8285 0 29.9703 4.1103 29.9703 9.134Z" fill="#F79E1B"/>
</svg>
</span>
                  </div>
                  <div className="w-8 h-5 b rounded flex items-center justify-center mx-3">
                    <span className="text-white text-xs font-bold">
                   
                    <svg width="80px" height="80px" viewBox="0 -140 780 780" enable-background="new 0 0 780 500" version="1.1"  ><path d="m293.2 348.73l33.359-195.76h53.358l-33.384 195.76h-53.333zm246.11-191.54c-10.569-3.966-27.135-8.222-47.821-8.222-52.726 0-89.863 26.551-90.181 64.604-0.297 28.129 26.515 43.822 46.754 53.185 20.771 9.598 27.752 15.716 27.652 24.283-0.133 13.123-16.586 19.115-31.924 19.115-21.355 0-32.701-2.967-50.225-10.273l-6.878-3.111-7.487 43.822c12.463 5.467 35.508 10.199 59.438 10.445 56.09 0 92.502-26.248 92.916-66.885 0.199-22.27-14.016-39.215-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.56-16.838 17.446-0.271 30.088 3.534 39.936 7.5l4.781 2.259 7.231-42.427m137.31-4.223h-41.23c-12.772 0-22.332 3.486-27.94 16.234l-79.245 179.4h56.031s9.159-24.121 11.231-29.418c6.123 0 60.555 0.084 68.336 0.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.187-195.64zm-65.417 126.41c4.414-11.279 21.26-54.724 21.26-54.724-0.314 0.521 4.381-11.334 7.074-18.684l3.606 16.878s10.217 46.729 12.353 56.527h-44.293v3e-3zm-363.3-126.41l-52.239 133.5-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.2 56.455-0.063 84.004-195.39-56.524-1e-3" fill="#0E4595"/><path d="m146.92 152.96h-86.041l-0.682 4.073c66.939 16.204 111.23 55.363 129.62 102.42l-18.709-89.96c-3.229-12.396-12.597-16.096-24.186-16.528" fill="#F2AE14"/></svg>
                    </span>
                  </div>
                  <div className="w-8 h-5 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      <Image
                      src={Verve}
                      
                      alt='verve logo '>
                     

                      </Image>
                    </span>
                  </div>
                </div>

                {/* Add/Edit Card Button */}
                {!hasCardSaved ? (
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="w-48 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Card details
                  </button>
                ) : (
                  <button
                    onClick={handleEditCard}
                    className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={20} />
                    Edit Card details
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {showAddCardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
              {/* Close Button */}
              <button
                onClick={() => setShowAddCardModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-event-blue rounded-lg  flex items-center justify-center text-white hover:bg-blue-900 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-semibold font-heading text-gray-900 mb-2">Add Card Details</h2>
              <p className="text-gray-600 mb-8 font-sans">Kindly fill in your Card details</p>

              {/* Card Number */}
              <div className="mb-6">
                <label className="block text-sm font-heading font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-6 bg-blue-900 rounded flex items-center justify-center">
                    <CreditCard className="text-white" size={16} />
                  </div>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                    className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-sans font-medium placeholder:font-sans placeholder:font-medium"
                    placeholder="XXXX - XXXX - XXXX - XXXX"
                  />
                </div>
              </div>

              {/* Expiration Date and CVV */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-heading font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expirationDate}
                    onChange={(e) => handleCardInputChange('expirationDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-sans font-medium placeholder:font-sans placeholder:font-medium"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium font-heading text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-sans font-medium placeholder:font-sans placeholder:font-medium"
                    placeholder="XXX"
                  />
                </div>
              </div>

              {/* Payment Method Icons */}
              <div className="flex items-center justify-center  gap-2 mb-6">
                  <div className="w-8 h-5  rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
<svg width="30" height="23" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9333 1.95312H19.0369V16.3138H10.9333V1.95312Z" fill="#FF5F00"/>
<path d="M11.4479 9.134C11.4479 6.21624 12.8371 3.62822 14.9722 1.95361C13.4031 0.735769 11.4223 0 9.26133 0C4.14176 0 0 4.08487 0 9.134C0 14.1831 4.14176 18.268 9.26121 18.268C11.4221 18.268 13.403 17.5322 14.9722 16.3143C12.8371 14.6651 11.4479 12.0518 11.4479 9.134Z" fill="#EB001B"/>
<path d="M29.9703 9.134C29.9703 14.183 25.8285 18.268 20.7091 18.268C18.5481 18.268 16.5673 17.5322 14.998 16.3143C17.159 14.6398 18.5225 12.0518 18.5225 9.134C18.5225 6.21624 17.1332 3.62822 14.998 1.95361C16.5672 0.735769 18.5481 0 20.7091 0C25.8285 0 29.9703 4.1103 29.9703 9.134Z" fill="#F79E1B"/>
</svg>
</span>
                  </div>
                  <div className="w-8 h-5 b rounded flex items-center justify-center mx-3">
                    <span className="text-white text-xs font-bold">
                   
                    <svg width="80px" height="80px" viewBox="0 -140 780 780" enable-background="new 0 0 780 500" version="1.1"  ><path d="m293.2 348.73l33.359-195.76h53.358l-33.384 195.76h-53.333zm246.11-191.54c-10.569-3.966-27.135-8.222-47.821-8.222-52.726 0-89.863 26.551-90.181 64.604-0.297 28.129 26.515 43.822 46.754 53.185 20.771 9.598 27.752 15.716 27.652 24.283-0.133 13.123-16.586 19.115-31.924 19.115-21.355 0-32.701-2.967-50.225-10.273l-6.878-3.111-7.487 43.822c12.463 5.467 35.508 10.199 59.438 10.445 56.09 0 92.502-26.248 92.916-66.885 0.199-22.27-14.016-39.215-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.56-16.838 17.446-0.271 30.088 3.534 39.936 7.5l4.781 2.259 7.231-42.427m137.31-4.223h-41.23c-12.772 0-22.332 3.486-27.94 16.234l-79.245 179.4h56.031s9.159-24.121 11.231-29.418c6.123 0 60.555 0.084 68.336 0.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.187-195.64zm-65.417 126.41c4.414-11.279 21.26-54.724 21.26-54.724-0.314 0.521 4.381-11.334 7.074-18.684l3.606 16.878s10.217 46.729 12.353 56.527h-44.293v3e-3zm-363.3-126.41l-52.239 133.5-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.2 56.455-0.063 84.004-195.39-56.524-1e-3" fill="#0E4595"/><path d="m146.92 152.96h-86.041l-0.682 4.073c66.939 16.204 111.23 55.363 129.62 102.42l-18.709-89.96c-3.229-12.396-12.597-16.096-24.186-16.528" fill="#F2AE14"/></svg>
                    </span>
                  </div>
                  <div className="w-8 h-5 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      <Image
                      src={Verve}
                      
                      alt='verve logo '>
                     

                      </Image>
                    </span>
                  </div>
                </div>

              {/* Save Button */}
              <button
                onClick={handleSaveCard}
                className="w-full bg-event-blue text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold font-heading  text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 font-sans ">Your card details have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Success Notification */}
        <SuccessNotification
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Successful"
          message="Your Personal Information has been saved successfully."
        />
      </div>
    </div>
  );
}
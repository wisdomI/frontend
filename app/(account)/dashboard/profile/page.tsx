'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Camera, Plus, X, CreditCard, Check, Edit, Trash2 } from 'lucide-react';
import SuccessNotification from '@/components/ui/SuccessNotification';

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
    dateOfBirth: 'DD/MM/YYY',
    bio: 'Type here',
    countryOfResidence: 'Nigeria',
    city: 'Lagos'
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCard = () => {
    // Save card details
    const maskedCardNumber = cardData.cardNumber.replace(/\d(?=\d{4})/g, '*');
    setSavedCard({
      cardNumber: maskedCardNumber,
      cardType: 'VISA' // You can determine this from card number
    });
    setHasCardSaved(true);
    setShowAddCardModal(false);
    setShowSuccessModal(true);

    // Hide success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    // Reset form
    setCardData({
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    });
  };

  const handleEditCard = () => {
    setShowAddCardModal(true);
  };

  const handleDeleteCard = () => {
    setHasCardSaved(false);
    setSavedCard(null);
    // Reset form
    setCardData({
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    });
  };

  const handleSaveProfile = () => {
    // Handle saving profile information
    setShowSuccessModal(true);
  };

  const tabs = ['Personal Information', 'Payment Details'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile Settings</h1>
      <div className="max-w-4xl ">
        {/* Page Title */}
        

        {/* Tab Navigation */}
        <div className="bg-blue-900 rounded-lg p-1 mb-8 inline-flex w-full max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3  text-sm font-medium transition-all duration-200 ${activeTab === tab
                ? ' text-white border-white  shadow-sm'
                : 'text-white hover:text-blue-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Form */}
        {activeTab === 'Personal Information' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="/images/profile-avatar.jpg"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
                    placeholder="DD/MM/YYY"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600" size={20} />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Type here"
                />
              </div>

              {/* Email - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                    <Image
                      src="/images/nigeria-flag.png"
                      alt="Nigeria"
                      width={20}
                      height={15}
                      className="mr-2"
                    />
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

              {/* Country of Residence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Residence
                </label>
                <select
                  value={formData.countryOfResidence}
                  onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>

              {/* City - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
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
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Payment Details Tab */}
        {activeTab === 'Payment Details' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Payment Details</h2>
              <p className="text-gray-600 mb-8">Save your debit card for faster checkout</p>

              {/* Local Bank Details Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Local Bank Details</h3>
                  </div>

                  {/* Saved Card Display */}
                  {hasCardSaved && savedCard && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold text-lg">VISA</span>
                        <span className="text-gray-600">7647**********5631</span>
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
                    <Check className="text-green-500" size={16} />
                    <span>Card information is secure and uncompromised</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="text-green-500" size={16} />
                    <span>All data is encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="text-green-500" size={16} />
                    <span>EventHub never sells your card information</span>
                  </div>
                </div>

                {/* Payment Method Icons */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                </div>

                {/* Add/Edit Card Button */}
                {!hasCardSaved ? (
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Card details
                  </button>
                ) : (
                  <button
                    onClick={handleEditCard}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={20} />
                    Edit Card details
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAddCardModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Add Card Details</h2>
            <p className="text-gray-600 mb-8">Kindly fill in your Card details</p>

            {/* Card Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="text-white" size={16} />
                </div>
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="XXXX - XXXX - XXXX - XXXX"
                />
              </div>
            </div>

            {/* Expiration Date and CVV */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="text"
                  value={cardData.expirationDate}
                  onChange={(e) => handleCardInputChange('expirationDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="XXX"
                />
              </div>
            </div>

            {/* Payment Method Icons */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">MC</span>
              </div>
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">VISA</span>
              </div>
              <div className="w-12 h-8 bg-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Verve</span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveCard}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
              <Check className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Your card details have been saved successfully.</p>
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
  );
}
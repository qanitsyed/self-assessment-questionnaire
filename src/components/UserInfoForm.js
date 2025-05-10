import React from 'react';

const UserInfoForm = ({ userData, setUserData, handleSubmit, showSampleReport, sampleAvailable }) => {
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Tell Us About Your Organization
            </h1>
            
            <p className="text-gray-600 mb-6">
              Please provide the following information before starting the assessment. This will help us customize your results.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="organization">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.organization}
                    onChange={(e) => setUserData({ ...userData, organization: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  Continue to Assessment
                </button>
                
                {sampleAvailable && (
                  <button
                    type="button"
                    onClick={showSampleReport}
                    className="bg-white border border-blue-600 hover:bg-blue-50 text-blue-600 font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
                  >
                    View Sample Report
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;

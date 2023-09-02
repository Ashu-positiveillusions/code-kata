import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({});

  const [applicationInitiated, setApplicationInitiated] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [isBalanceSheetFetched, setIsBalanceSheetFetched] = useState(false);
  const [balanceSheet, setbalanceSheet] = useState([]);
  const [finalMessage, setFinalMessage] = useState("");
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const axiosCall = async (config) => {
    let response = await axios.request(config);
    return response.data;
  };

  const handleSubmitApplicationInitiatingForm = async (event) => {
    event.preventDefault();
    setApplicationInitiated(true);
    console.log("Submitted data:", formData);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://192.168.0.104:4000/initiateApplication",
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    };
    let initialResponse = await axiosCall(config);
    setApplicationId(initialResponse.data._id);
  };

  const handleSelectChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, accountingProvider: selectedValues[0] });
  };

  const handleSubmitBusinessDetailsAndSheetForm = async (event) => {
    event.preventDefault();
    setIsBalanceSheetFetched(true);
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://192.168.0.104:4000/fetchBalanceSheet/${applicationId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    };
    let balanceSheetResponse = await axiosCall(config);
    setbalanceSheet(balanceSheetResponse.data.balanceSheet);
  };

  const handleFinalSubmit = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://192.168.0.104:4000/submitApplicationForLoan/${applicationId}`,
      headers: {
        "Content-Type": "application/json",
      },
      // data: formData,
    };
    let applicationResponse = await axiosCall(config);
    console.log(
      "applicationResponseapplicationResponseapplicationResponseapplicationResponse",
      applicationResponse
    );
    setFinalMessage(applicationResponse.message);
  };

  const ApplicationInitiatingForm = () => {
    return (
      <>
        <form
          onSubmit={handleSubmitApplicationInitiatingForm}
          style={formStyle}
        >
          <div className="form-group">
            <label htmlFor="Name" style={labelStyle}>
              Name of Business :{" "}
            </label>
            <input
              type="text"
              id="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={applicationInitiated}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={applicationInitiated}
          >
            Initiate Application
          </button>
        </form>
      </>
    );
  };

  const BusinessDetailsAndSheetForm = () => {
    return (
      <>
        <h2 style={{ margin: "10px" }}>Business Details</h2>
        <form
          onSubmit={handleSubmitBusinessDetailsAndSheetForm}
          style={formStyle}
        >
          <div className="form-group">
            <label htmlFor="BusinessIdentificationNumber" style={labelStyle}>
              Business Identification Number :{" "}
            </label>
            <input
              type="text"
              id="BusinessIdentificationNumber"
              name="businessIdentificationNumber"
              value={formData.businessIdentificationNumber}
              onChange={handleInputChange}
              required
              disabled={isBalanceSheetFetched}
              style={inputStyle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="EstablishmentYear" style={labelStyle}>
              Establishment Year :{" "}
            </label>
            <input
              type="number"
              id="EstablishmentYear"
              name="establishmentYear"
              value={formData.establishmentYear}
              onChange={handleInputChange}
              required
              disabled={isBalanceSheetFetched}
              style={inputStyle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="LoanAmount" style={labelStyle}>
              Amount for Loan :{" "}
            </label>
            <input
              type="number"
              id="LoanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              required
              disabled={isBalanceSheetFetched}
              style={inputStyle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountingProvider" style={labelStyle}>
              Select Your Accounting Provider :{" "}
            </label>
            <select
              value={formData.accountingProvider}
              onChange={handleSelectChange}
              style={selectStyle}
              disabled={isBalanceSheetFetched}
            >
              <option value="MYOB" style={optionStyle}>
                MYOB
              </option>
              <option value="Xero" style={optionStyle}>
                Xero
              </option>
            </select>
          </div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={isBalanceSheetFetched}
          >
            Fetch Balance Sheet
          </button>
        </form>
      </>
    );
  };

  const Modal = () => {
    // if (!isOpen) return null;
    const modalStyle = {
      display: finalMessage.length ? 'block' : 'none', // Show or hide the modal
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent background
      zIndex: '1',
      alignItems: 'center',
      justifyContent: 'center', 
    };
    
    const modalContentStyle = {
      backgroundColor: '#0000',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    };
    return (
      <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>RESULT</h2>
        <p>{finalMessage}</p>
      </div>
    </div>
    );
  };

  const DisplayBalanceSheet = () => {
    return (
      <div>
        <h2>Balance Sheet</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Profit or Loss</th>
              <th style={thStyle}>Assets Value</th>
            </tr>
          </thead>
          <tbody>
            {balanceSheet.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.year}</td>
                <td style={tdStyle}>{item.month}</td>
                <td style={tdStyle}>{item.profitOrLoss}</td>
                <td style={tdStyle}>{item.assetsValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleFinalSubmit} style={buttonStyle} disabled={finalMessage}>
          Review and Submit Application
        </button>
      </div>
    );
  };
  return (
    <div className="App">
      <header className="App-header">Business Loan Application</header>
      <div className="main-body">
        {ApplicationInitiatingForm()}
        {applicationInitiated ? BusinessDetailsAndSheetForm() : null}
        {balanceSheet.length ? DisplayBalanceSheet() : null}
        {finalMessage ? Modal() : null}
      </div>
    </div>
  );
}


const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyle = {
  background: "#334872",
  fontWeight: "bold",
  padding: "10px",
  textAlign: "center",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
const labelStyle = {
  fontSize: "1rem", // Adjust the font size
  fontWeight: "bold", // Bold labels
  textAlign: "center", // Align labels to the left
  marginBottom: "10px", // Spacing below labels
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const inputStyle = {
  // width: "100%",
  maxWidth: "300px", // Equal sizes for input fields
  padding: "8px",
  marginBottom: "10px", // Spacing between input fields
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginTop: "5px",
};

const buttonStyle = {
  width: "20%",
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
  marginBottom: "10px",
};
const selectStyle = {
  width: "200px",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#fff",
  fontSize: "16px",
  color: "#333",
  cursor: "pointer",
};

const optionStyle = {
  backgroundColor: "#fff",
  color: "#333",
  padding: "8px",
  fontSize: "16px",
};

export default App;

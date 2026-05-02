import React, { useEffect, useState } from "react";
import Creativepanels from "./Creativepanels";
import axios from "axios";
import "../css/creative.css";
import { useNavigate } from "react-router-dom";

function Creative() {
  const [accounts, setAccounts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);
const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");
const [showCreative, setShowCreative] = useState(false);
  const [outputs, setOutputs] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://127.0.0.1:5000/accounts")
      .then(res => setAccounts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAccountChange = async (id) => {
    setSelectedAccount(id);
    setSelectedDealers([]); 

    try {
      const res = await axios.get(`http://127.0.0.1:5000/dealerships/${id}`);
      setDealers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 
 const handleDealerSelect = (id) => {
  setSelectedDealers(prev =>
    prev.includes(id)
      ? prev.filter(d => d !== id)
      : [...prev, id]
  );
};

 
  const handleGenerate = async () => {

  if (!image) {
    alert("Upload image");
    return;
  }

  if (selectedDealers.length === 0) {
    alert("Select dealers");
    return;
  }

  const formData =
    new FormData();

  formData.append(
    "image",
    image
  );

  selectedDealers.forEach(
    id =>
      formData.append(
        "dealers",
        id
      )
  );



  try {

    const res =
      await axios.post(

        "http://127.0.0.1:5000/generate",

        formData
      );



    const files =
      res.data;



    
    files.forEach(
      file => {

        const link =
          document.createElement(
            "a"
          );

        link.href =

          `http://127.0.0.1:5000/download/${file}`;


        link.download =
          file;


        document.body.appendChild(
          link
        );


        link.click();


        document.body.removeChild(
          link
        );

      }
    );



    
    navigate(

      "/creativepanels",

      {
        state: {

          dealerIds:
            selectedDealers,

          preview

        }
      }
    );



  } catch (err) {

    console.error(
      err
    );

  }
};




  return (
    <div className="container">
      <h2>Creative Generator</h2>

      <select
        value={selectedAccount}
        onChange={(e) => handleAccountChange(e.target.value)}
      >
        <option value="">-- Select Brand --</option>
        {accounts.map(a => (
          <option key={a._id} value={a._id}>
  {a.name}
</option>
        ))}
      </select>

      
      {selectedAccount && (
        <div className="dealer-list">
          <h4>Select Dealerships</h4>

          {dealers.length === 0 ? (
            <p>No dealers available</p>
          ) : (
            dealers.map(d => (
  <label key={d._id} className="dealer-item">
    <input
      type="checkbox"
      checked={selectedDealers.includes(d._id)}
      onChange={() => handleDealerSelect(d._id)}
    />
    {d.name}
  </label>
))
          )}
        </div>
      )}

      
      <input
  type="file"
  accept=".png,.jpg,.jpeg"
  onChange={(e) => {

    const file = e.target.files[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    const isValid =
      fileName.endsWith(".png") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg");

    if (!isValid) {
      alert("Only PNG or JPG images allowed");
      e.target.value = "";
      return;
    }

    setImage(file);

    
    setPreview(
      URL.createObjectURL(file)
    );
  }}
/>

      
      <button onClick={handleGenerate}>Generate</button>
      
    </div>
  );
}


export default Creative;
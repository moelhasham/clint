import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  const notify = (m) => toast(m)
  const [amount, setAmount] = useState(100000);
  class MoamalataPay {
    constructor(MID, TID, key, amount, merchantReference = "") {
        this.MID = MID;
        this.TID = TID;
        this.key = this.hex_to_str(key);
        this.amount = amount;
        this.merchantReference = merchantReference;
        this.dateTimeLocalTrxn = null;
    }

    hex_to_str(hex) {
        let str = "";
        for (let i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    
    set_datetimelocaltrxn() {
        this.dateTimeLocalTrxn = Number.parseInt(Date.now() / 1000).toString();
    }

    encode_data() {
        return `Amount=${this.amount}&DateTimeLocalTrxn=${this.dateTimeLocalTrxn}&MerchantId=${this.MID}&MerchantReference=${this.merchantReference}&TerminalId=${this.TID}`;
    }

    get_secure_hash() {
        let data = this.encode_data();
        let hash = CryptoJS.HmacSHA256(data, this.key).toString().toUpperCase();
        console.log({
            data,
            hash,
            key: this.key
        });
        return hash;
    }

    pay(amount = null, merchantReference = null) {
        if (amount !== null) {
            this.amount = amount;
        }
        if (merchantReference !== null) {
            this.merchantReference = merchantReference;
        }

        console.log("Starting pay");

        this.set_datetimelocaltrxn();

        Lightbox.Checkout.configure = {
            MID: this.MID,
            TID: this.TID,
            AmountTrxn: this.amount,
            MerchantReference: this.merchantReference,
            TrxDateTime: this.dateTimeLocalTrxn,
            SecureHash: this.get_secure_hash(),
            completeCallback: function (data) {
              notify("completed")
                console.log({
                    "status": "completed",
                    data
                });
            },
            errorCallback: function (error) {
             
                console.log({
                    "status": "error",
                    error
                });
            },
            cancelCallback: function () {
              notify("canceled")
                console.log({
                    "status": "canceled"
                });
            },
        };

        Lightbox.Checkout.showLightbox();
    }
}


    const handlePay = () => {
        const moamalatPay = new MoamalataPay('10040898689', '88529158', '31643564383937632D356564342D343539362D383033622D623839393566383364643138');
        moamalatPay.pay(amount, 'texref');
       
    };
  return (
    
    <div>
      <ToastContainer position="bottom-left"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
    />
    <button onClick={handlePay}>Pay</button>
</div>
  )
}


export default App

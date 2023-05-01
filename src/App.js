import { useRef, useEffect, useState } from "react";
import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill'
function App() {
  const video = useRef(null);
  const canvas = useRef(null);
  const [barcode, setBarcode] = useState(null);
  const [basket, setBasket] = useState([]);

  const openCam = () => {
     navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 300,
          height: 300,
          facingMode: "environment", // mobilde arka kamerayı açtırmak için
        },
      })
      .then(async(stream) => {

        video.current.srcObject = stream;
        video.current.play();

        const ctx = canvas.current.getContext("2d");

        // const barcode = window.BarcodeDetector({
        //   formats: ["qr_code", "ean_13"],
        // });
        const barcode = new BarcodeDetectorPolyfill({ formats: ['qr_code','code_39', 'code_128', 'ean_13'] })
        // const barcode = new BarcodeDetectorPolyfill({ 
        //   formats: ['qr_code'],
        //   zbar: {
        //       encoding: 'iso-8859-15'
        //   }
        // })
        // const barcodes = await barcode.detect(canvas.current)
        setInterval(async () => {
          canvas.current.width = video.current.videoWidth;
          canvas.current.height = video.current.videoHeight;
          ctx.drawImage(
            video.current,
            0,
            0,
            video.current.videoWidth,
            video.current.videoHeight
          );
          await barcode
            .detect(canvas.current)
            .then(([data]) => {
              console.log(data)
              if (data) {
                setBarcode(data.rawValue);
              }
            })
            .catch((err) => console.log(err));
        }, 1000);
      })
      .catch((err) => alert(err));
  };

  // useEffect(() => {
  //   if (barcode) {
  //     // kendinize uygun şekilde endpointi değiştirip kullanın
  //     const API_URL = `http://localhost/api.php?barcode=${barcode}`;

  //     fetch(API_URL)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data) {
  //           setBasket([...basket, data]);
  //         } else {
  //           alert("Bu ürün bulunamadı!");
  //         }
  //       });
  //   }
  // }, [barcode]);

  return (
    <>
      <button onClick={openCam}>activar camara</button>
      <div>
        <video ref={video} autoPlay muted hidden />
        <canvas ref={canvas} />
      </div>
      {barcode && <div>codigo: {barcode}</div>}
      {/* {basket &&
        basket.map((item) => (
          <div key={item.id}>
            {item.product} <br />
            {item.price} <br />
            <img src={item.image} style={{ width: 100, height: 100 }} />
          </div>
        ))} */}
    </>
  );
}

export default App;

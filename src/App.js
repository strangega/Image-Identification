import * as mobilenet from "@tensorflow-models/mobilenet";
// import { div } from "@tensorflow/tfjs-core";
import '@tensorflow/tfjs-backend-webgl';
import { useState,useEffect,useRef } from "react";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isModelLoading,setIsModelLoading]=useState(false);
  const [model,setModel]=useState(null)
  const [imgUrl,setImgUrl]=useState(null)
  const [predictions, setPredictions] = useState([])
  const imageRef=useRef()
  const textInput=useRef()
  const fileInput=useRef()
  const [history,setHistory]=useState([])

  const loadModel=async()=>{
    setIsModelLoading(true)
    try{
      const model= await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    }catch(error){
      console.log(error)
      setIsModelLoading(false)
    }
  }
const uploadImage=(event)=>{
  const {files}  =event.target
  if(files.length>0){
    const url=URL.createObjectURL(files[0])
    setImgUrl(url)
    setPredictions([]);
  }else{
    setImgUrl(null);
    setPredictions([]);
  }
}
const Identify=async()=>{
  textInput.current.value=""
   if (model && imageRef.current) {
      try {
        const results = await model.classify(imageRef.current);
        console.log(results);
        setPredictions(results);
      } catch (error) {
        console.error('Error during classification:', error);
      }
    }
}
const handleOnChange=(e)=>{
  setImgUrl(e.target.value)
  setPredictions([])
}
const triggerUpload=()=>{
  fileInput.current.click()
}

 useEffect(()=>{
  if(imgUrl){
    setHistory([imgUrl,...history])
  }
 },[imgUrl])
  useEffect(()=>{
    loadModel()
  },[])
  if(isModelLoading){
    return <div className="load">
    <div class="d-flex ">
  <div class="spinner-border" role="status" style={{width:"90px",height:"90px"}}>
    <span class="visually-hidden">Loading...</span>
  </div><br/>
</div>
    <h3>Model is on the way ...</h3></div>
  }
// console.log(predictions)
  
  return (
   
    <div className="App">
       
  
      <h1 className="Header">Image Identification</h1>
      <div className="inputHolder">
        <input type="file" accept="image/*" capture='camera' className="uploadInp" onChange={uploadImage} ref={fileInput}/>
        <button className="uploadImage button" onClick={triggerUpload}>Upload Image</button>
        <span className="or">OR</span>
        <input type="text" placeholder="paste Image Url" ref={textInput} onChange={handleOnChange}/>
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageholder">
           {imgUrl &&  <img src={imgUrl} alt="Upload Preview" className="Img" crossOrigin="anonymous" ref={imageRef}/>}
           {predictions.length>0 && <div className="ResultDisplay">
            {predictions.map((result,index)=>{
              return (
                <div className={`result res${index}`} key={result.className}>
                  <span className="name">{result.className.toUpperCase()}</span>
                  <span className="confidence">Confidence level:{(result.probability*100).toFixed(2)}%{index==0 &&<span className="bestGuess">Best Guess</span>}
                  </span>
                </div>
              )
            })}
            </div>}
          </div>
        </div>
        {imgUrl && <button className="button" onClick={Identify}>Identify Image</button>}
      </div>
      {history.length>0 && <div className="history">
        <u><h2>Recent Image</h2></u>
        <div className="recent">
          {history.map((image,index)=>{
            return (
              <div className="recentPrediction" key={`${image}${index}`}>
                <img src={image} className="histImg" alt='Recent Prediction' onClick={()=>{
                  setImgUrl(image)
                }}/>
              </div>
            )
          })}
        </div>
      </div>}

    </div>
    

  );
}

export default App;

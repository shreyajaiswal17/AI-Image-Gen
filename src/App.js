import { useState } from 'react';
import './App.css';
import ImageGenerator from './Components/ImageGenerator/ImageGenerator';
import axios from 'axios';
import './Components/ImageGenerator/ImageGenerator.css';



function App() {

  const[data, setData] = useState('');
  const[loading, setLoading] =useState(false);


  const [state, setState] = useState({
    input: '',
  });

  
  const onChangeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    setLoading(true); 
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
        { inputs: state.input },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HF_AUTH_TOKEN}`, 
          },
          responseType:'blob'
        }
      );
      const data = await response.data;
      // console.log(response.data);

      const blobUrl = URL.createObjectURL(data)

      setData(blobUrl)
    } catch (error) {
      console.error('Error:', error.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <ImageGenerator />
      <div className='loading'>
        <div className={loading?'loading-bar': "loading-bar"}>
          <div className={loading?'loading-text': "display-none"}>
            Loading...
          </div>
        </div>

      </div>

      <form onSubmit={onSubmitHandler} className="search-box">
        
        <input
          name="input"
          value={state.input}
          onChange={onChangeHandler}
          type="text"
          className="search-input"
          placeholder="Describe what kind of image you want!"
        />
        <button type="submit" className="btn">
          Generate
        </button>
        
      
      </form>

      {/* {loading && <div className="loading-bar">
        Loading..
      </div> 
      } */}
     


      {
        data && <img src ={data} className="image-gen" alt={'image-get'}/>
      }
    </>
  );
}

export default App;




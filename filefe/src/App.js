import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [inputKey, setInputKey] = useState(Date.now());

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [items, setItems] = useState()

  const [uploading, setUploading] = useState(false)

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async (e) => {
    e.preventDefault()

    setUploading(true)

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setFileUrl(response.data.fileUrl);
      setFile(null);
      setInputKey(Date.now());

      const update = await axios.get("http://localhost:5000/files")
      setItems(update.data.files)

      setUploading(false)
    } catch (error) {
      console.error('File upload failed', error);
      setFile(null);
      setInputKey(Date.now());
      setUploading(false)
    }
  }

  useEffect(()=>{
    axios.get("http://localhost:5000/files")
      .then(res=>{
        setItems(res.data.files)
      })
  },[])

  return (
    <div className="page flex-column flex align-center">
      <div className="form"
      style={{margin: '32px 0', width: '100%', maxWidth: '540px', minHeight: '200px', padding: '24px', border: '1px solid black', borderRadius: '10px'}}>
        <form onSubmit={onFileUpload}>
          <div className='font-inter' style={{textAlign: 'center', fontSize: '24px', fontWeight: '600', marginBottom: '24px'}}>
            Upload Photo
          </div>
          <div className='font-inter' style={{marginBottom: '16px'}}>
            <label htmlFor="image" style={{marginRight: '10px'}}>
              Select image
            </label>
            <input key={inputKey} type="file" name="image" id="image" onChange={onFileChange} required />
          </div>
          <div className='flex justify-end'>
            {
              uploading? <input className='font-inter' style={{height: '44px', width: '150px', borderRadius: '26px'}}
              type="submit" value="Uploading" disabled/>:
              <input className='font-inter' style={{height: '44px', width: '150px', borderRadius: '26px'}}
              type="submit" value="Upload" />
            }
          </div>
            {fileUrl &&
            <div className='font-inter' style={{marginTop: '24px'}}>
              Uploaded: <a href={fileUrl} target='blank'>{fileUrl}</a>
            </div>}
        </form>
      </div>
      <div className="library flex flex-wrap" style={{padding: '18px', border: '1px solid black', borderRadius: '10px',
        width: '100%', maxWidth: '540px'}}>
        {
          items && items.map((item, i)=>(
              <img className='flex' key={i} src={item.url} alt="" width="250"/>
          ))
        }
      </div>
    </div>
  );
}

export default App;

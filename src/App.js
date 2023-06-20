import { useState } from 'react';
import './App.css';
import BackgroundAnimate from './BackgroundAnimate';
import InputShortener from './InputShortener';
import LinkResult from './LinkResult';

function App() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="container">
      <div className="blur">
        <InputShortener setInputValue={setInputValue} />
        <BackgroundAnimate />
        <LinkResult inputValue={inputValue} />
      </div>
    </div>
  );
}

export default App;

import axios from "axios";
import { useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard";

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [trigger,setTrigger] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const options = {
        method: "POST",
        url: "https://url-shortener42.p.rapidapi.com/shorten/",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "0c4930f236msh09091024dc78c2ap1ad813jsn9da7c6fe8d63",
          "X-RapidAPI-Host": "url-shortener42.p.rapidapi.com",
        },
        data: {
          url: inputValue,
          validity_duration: 10,
        },
      };

      const response = await axios.request(options);
      setShortenLink(response.data.url)
      console.log(response.data);

    } catch(err) {
      setShortenLink(null)
      setTrigger(true);
      setError(err);
      setTimeout(()=>{
          setError("");
      },3000)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(inputValue.length) {
      fetchData();
    }
  }, [inputValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  if(loading) {
    return <p className="noData">Loading...</p>
  }
  if(error) {
    return <p className="noData">Invalid Link (check for typos)</p>
  }

  return (
    <>
      {shortenLink && (
        <div className="result">
          <p>{shortenLink}</p>
          <CopyToClipboard text={shortenLink} onCopy={() => setCopied(true)}>
            <button className={copied ? "copied" : ""}>Copy link</button>
          </CopyToClipboard>
 
        </div>
      )}
    </>
  );
}

export default LinkResult
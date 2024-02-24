import axios from "axios";
import { useEffect, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard";

const LinkResult = ({ inputValue }) => {
  const [shortenLink, setShortenLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [trigger,setTrigger] = useState(true);

  const base_url = "https://short-url-api-5fwd.onrender.com/";
  const fetchData = async () => {

    try {
      setLoading(true);
      setError(false);
      
      const options = {
        method: "GET",
        url: base_url + "create?url=" + inputValue
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
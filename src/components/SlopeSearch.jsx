import React , { useState } from "react";

const SlopeSearch = () => {

    const [postcode, setPostcode] = useState("");
    const [codeValid, setCodeValid] = useState(false);
    const [foundSlopes, setFoundSlopes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handlePostcode = (e) => {
        e.preventDefault();
        setPostcode(e.target.value);
        setCodeValid(/^[A-Z]{1,2}\d{1,2}[A-Z\d]? ?\d{1,2}[A-Z]{2}$/i.test(e.target.value));
    }

    const handleSubmit =  async (e) => { 
        e.preventDefault();
        setFoundSlopes([]);
        setErrorMessage('');
        const res = await fetch(`/api/getslopes/${postcode}`);
        const status = res.status;
        const data = await res.json();
        
        if (status === 200) {
            setFoundSlopes(data);
        } else {
            setErrorMessage(data.error);
        }
    }

    // capture <enter> key from 'search' input and divert
    const checkEnterKey = (e) => {
        if (e.keyCode == 13 && codeValid) {
            e.preventDefault();
            const fakeE = { preventDefault: () => { } };
            handleSubmit(fakeE);
        }
    };

    return (
        <div className="row">
            <hr />
            <h2>Find A Slope</h2>
            <p>Enter your postcode and search to find the nearest slope</p>
            
            <div className="postcode-form">
                <input
                    type="text"
                    id="searchpostcode"
                    name="searchpostcode"
                    onChange={handlePostcode}
                    onKeyDown={checkEnterKey}
                    value={postcode}
                    placeholder="postcode"
                />
                <button
                    disabled={!codeValid}
                    onClick={handleSubmit}
                >
                    Search
                </button>
            </div>
            
            { foundSlopes && foundSlopes.length > 0 && (
                <>
                    <br />
                    <table>
                        <tbody>
                        {
                            foundSlopes.map((slope, idx) => (
                                <tr key={idx}>
                                    <td>{slope.name}</td>
                                    <td>{slope.distance} miles</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </>
            )}

            { errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
            )}

            <p><i>Search is limited to the slopes/centres in and around the LSERSA region</i></p>
        </div>
    )
}

export default SlopeSearch;
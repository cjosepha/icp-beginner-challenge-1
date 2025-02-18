import { useState, useEffect } from "react";
import IdentityLogin from "./components/IdentityLogin";
import IdentityLogout from "./components/IdentityLogout";

function App() {
  const [backendActor, setBackendActor] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [results, setResults] = useState();

  function processProfileResponse(response, displayError = true) {
    if (response.ok) {
      setErrorMessage(null);
      setUserId(response.ok.id.toString());
      setUserName(response.ok.name);
    } else if (response.err) {
      setErrorMessage(displayError ? response.err : null);
      setUserId(null);
      setUserName(null);
    } else {
      console.error(response);
      setErrorMessage(displayError ? "Unexpected error, check the console" : null);
      setUserId(null);
      setUserName(null);
    }
  }

  function processResultsResponse(response, displayError = true) {
    if (response.ok) {
      setErrorMessage(null);
      setResults(response.ok.results);
    } else if (response.err) {
      setErrorMessage(displayError ? response.err : null);
      setResults(null);
    } else {
      console.error(response);
      setErrorMessage(displayError ? "Unexpected error, check the console" : null);
      setResults(null);
    }
  }

  function handleSubmitUserProfile(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    backendActor.setUserProfile(name).then((response) => {
      processProfileResponse(response);
    });
    return false;
  }

  function handleSubmitUserResult(event) {
    event.preventDefault();
    const result = event.target.elements.result.value;
    backendActor.addUserResult(result).then((response) => {
      processResultsResponse(response);
    });
    return false;
  }

  useEffect(() => {
    if (backendActor) {
      backendActor.getUserProfile()
        .then((response) => {
          processProfileResponse(response, false);
        });
      backendActor.getUserResults()
        .then((response) => {
          processResultsResponse(response, false);
        });
    }
  }, [backendActor]);

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <h1>Welcome to ICP BOOTCAMP!</h1>
      <br />
      <br />
      {!backendActor && (
        <section id="identity-section">
          <IdentityLogin setBackendActor={setBackendActor}></IdentityLogin>
        </section>
      )}
      {backendActor && (
        <section id="identity-section">
          <IdentityLogout setBackendActor={setBackendActor}></IdentityLogout>
        </section>
      )}
      {backendActor && (
        <>
          { (!userName || !userId) &&
            <form action="#" onSubmit={handleSubmitUserProfile}>
              <label htmlFor="name">Enter your name: &nbsp;</label>
              <input id="name" alt="Name" type="text" />
              <button type="submit">Save</button>
            </form>
          }
          { userName && userId &&
            <form action="#" onSubmit={handleSubmitUserResult}>
              <label htmlFor="name">Enter a result: &nbsp;</label>
              <input id="result" alt="Result" type="text" />
              <button type="submit">Add</button>
            </form>
          }
          { userId && <section className="response">User ID: {userId}</section> }
          { userName && <section className="response">User Name: {userName}</section> }
          { results && <section className="response">User Results: {results.length > 0 ? results.toString() : "none"}</section> }
          { errorMessage && <section className="response">{errorMessage}</section> }
        </>
      )}
    </main>
  );
}

export default App;

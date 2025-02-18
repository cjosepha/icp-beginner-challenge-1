import { useState, useEffect } from "react";
import IdentityLogin from "./components/IdentityLogin";
import IdentityLogout from "./components/IdentityLogout";

function App() {
  const [backendActor, setBackendActor] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [errorMessage, setErrorMessage] = useState();

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

  function handleSubmitUserProfile(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    backendActor.setUserProfile(name).then((response) => {
      processProfileResponse(response);
    });
    return false;
  }

  useEffect(() => {
    if (backendActor) {
      backendActor.getUserProfile()
        .then((response) => {
          processProfileResponse(response, false);
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
          { userId && <section className="response">User ID: {userId}</section> }
          { userName && <section className="response">User Name: {userName}</section> }
          { errorMessage && <section className="response">{errorMessage}</section> }
        </>
      )}
    </main>
  );
}

export default App;

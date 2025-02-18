import { AuthClient } from "@dfinity/auth-client";

function IdentityLogout(props) {
  
  async function handleLogout() {
    const authClient = await AuthClient.create();
    await props.setBackendActor(null);
    await new Promise(() =>
      authClient.logout()
    );
  }

  return (
    <button class="button-4" onClick={handleLogout} role="button">
      Logout
    </button>
  );
  
}

export default IdentityLogout;

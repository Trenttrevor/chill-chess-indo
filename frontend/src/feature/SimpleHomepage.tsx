import { SignInButton, SignUpButton, Show, SignOutButton } from "@clerk/react";

const SimpleHomepage = () => {
  return (
    <div>
      <h1>Welcome to ChillChessIndo</h1>

      <Show when={"signed-out"}>
        <SignInButton mode="modal" forceRedirectUrl="/puzzle">
          <button>Sign In</button>
        </SignInButton>

        <SignUpButton mode="modal" forceRedirectUrl="/puzzle">
          <button>Sign Up</button>
        </SignUpButton>
      </Show>

      <Show when={"signed-in"}>
        <SignOutButton>
          <button>sign out</button>
        </SignOutButton>
      </Show>

      <Show when={"signed-in"}>
        <p>You are signed in</p>
      </Show>
    </div>
  );
};

export default SimpleHomepage;

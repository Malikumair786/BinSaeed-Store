import Link from "next/link";
import React from "react";

const App = () => {
  return (
    <>
      <div>
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
      <div>
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  );
};

export default App;

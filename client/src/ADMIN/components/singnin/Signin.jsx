import "./signin.scss";

const Signin = ({ closeSign }) => {
  return (
    <>
      <div className="signin">
        <h1>Hwyeyyey</h1>
        <button onClick={closeSign}>Close</button>
      </div>

      <div className="overlay-signin" onClick={closeSign}></div>
    </>
  );
};

export default Signin;

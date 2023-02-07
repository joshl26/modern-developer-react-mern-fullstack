import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { Link } from "react-router-dom";

import { usePersist } from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const handleToggle = () => setPersist((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const errClass = errMsg ? "errMsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p className={errClass} ref={errRef} aria-live="assertive">
          {errMsg}
        </p>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            type="text"
            className="form__input"
            autoComplete="off"
            required
          />
          <label htmlFor="password">
            <input
              type="password"
              className="form__input"
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
            />
          </label>
          <button className="form__submit-button">Sign In</button>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
              className="form__checkbox"
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
  return content;
};

export default Login;

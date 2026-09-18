import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(email, password);

      console.log("LOGIN RESPONSE:", res);

      const data = res.data || res;

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "superadmin":
          navigate("/super-admin");
          break;

        case "train_driver":
          navigate("/driver");
          break;

        case "railway":
          navigate("/driver");
          break;

        case "forest":
          navigate("/driver");
          break;

        case "viewer":
          navigate("/driver");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "380px",
          maxWidth: "100%",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #22c55e",
        }}
      >
        <h2
          style={{
            color: "#22c55e",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          ACAN Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: loading ? "#166534" : "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <br />
        <br />

        <button
          onClick={() => navigate("/forgot-password")}
          style={{
            width: "100%",
            padding: "10px",
            background: "transparent",
            color: "#22c55e",
            border: "1px solid #22c55e",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Forgot Password
        </button>
      </div>
    </div>
  );
}

export default Login;
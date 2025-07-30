import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import toast from "react-hot-toast";

export default function Signup() {
  const { register } = useContext(Appcontext);
  const [formData, setformData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    organization: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
    } catch (error) {
      // Error handling is done in the register function
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 w-full max-w-[340px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        <input
          id="username"
          className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />

        <input
          id="email"
          className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input
          id="password"
          className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <div>
          <div>
            {/* do input ka same naam rakhoge toh ek select karoge toh dusra aapi aap unselectted ho jaaega */}
            <input
              type="radio"
              id="role"
              value="user"
              checked={formData.role === "user"}
              onChange={handleChange}
            />
            <label htmlFor="user">User</label>
          </div>
          <div>
            <input
              type="radio"
              id="role"
              value="admin"
              checked={formData.role === "admin"}
              onChange={handleChange}
            />
            <label htmlFor="admin">Admin</label>
          </div>
        </div>
        <input
          id="organization"
          className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="text"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Organization"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 py-2.5 rounded text-white font-medium"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center mt-4">
          Already have an account?
          <Link to={"/login"} className="text-blue-500 underline ml-1">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

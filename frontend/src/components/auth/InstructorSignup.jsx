import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FaEye, FaEyeSlash, FaChalkboardTeacher } from "react-icons/fa"
import { registerWithSupabase } from "../../services/operations/authAPI"
import { setSignupData } from "../../slices/authSlice"
import { toast } from "react-hot-toast"

export default function InstructorSignup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    country: "",
    expertise: "",
    experience: "",
    linkedin: "",
    bio: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Full name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Must be 8+ characters"
    if (formData.password !== formData.confirm) newErrors.confirm = "Passwords do not match"
    return newErrors
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
  }

  const submit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    try {
      setLoading(true)
      
      const nameParts = formData.name.split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ")

      dispatch(setSignupData({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        accountType: "Instructor",
        contactNumber: formData.phone,
      }))

      await dispatch(registerWithSupabase(navigate))
      
      toast.success("Signup Successful! Please verify your email.")
      navigate("/verify-email")
    } catch (e) {
      toast.error(e.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl bg-surface p-6 sm:p-8 rounded-xl shadow-sm border border-border"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-surface-2 text-accent rounded-xl flex items-center justify-center mx-auto mb-3 border border-border">
            <FaChalkboardTeacher className="text-lg" />
          </div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">Instructor Registration</h1>
          <p className="mt-1 text-muted text-xs">Join our faculty and build academic course offerings</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                className={`input-field ${errors.name ? 'border-danger focus:border-danger' : ''}`}
                placeholder="Dr. Alan Turing"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="mt-1 text-[11px] text-danger">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                className={`input-field ${errors.email ? 'border-danger focus:border-danger' : ''}`}
                placeholder="alan@university.edu"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="mt-1 text-[11px] text-danger">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`input-field pr-9 ${errors.password ? 'border-danger focus:border-danger' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-danger">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirm"
                className={`input-field ${errors.confirm ? 'border-danger focus:border-danger' : ''}`}
                placeholder="••••••••"
                value={formData.confirm}
                onChange={handleInputChange}
              />
              {errors.confirm && <p className="mt-1 text-[11px] text-danger">{errors.confirm}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Primary Subject Expertise</label>
              <input
                type="text"
                name="expertise"
                className="input-field"
                placeholder="Algorithms, Operating Systems, Compilers"
                value={formData.expertise}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Teaching Experience (Years)</label>
              <input
                type="text"
                name="experience"
                className="input-field"
                placeholder="5"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Academic / LinkedIn Profile</label>
              <input
                type="text"
                name="linkedin"
                className="input-field"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Contact Phone Number</label>
              <input
                type="text"
                name="phone"
                className="input-field"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1.5">Faculty Bio & Research Summary</label>
            <textarea
              name="bio"
              className="input-field"
              placeholder="Brief summary of your academic background and teaching interests..."
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Create Instructor Account</span>
            )}
          </button>

          <p className="text-center text-xs text-muted mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

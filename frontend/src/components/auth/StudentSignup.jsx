import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { FaEye, FaEyeSlash, FaGoogle, FaUserPlus } from "react-icons/fa"
import { authService } from "../../services/auth"
import { setUser } from "../../slices/profileSlice"
import { supabase } from "../../config/supabaseClient"
import { toast } from "react-hot-toast"

export default function StudentSignup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    country: "",
    interests: "",
    rollNumber: "",
    departmentId: "",
    semester: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch departments from Supabase
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .order('name')
        
        if (!error && data) {
          setDepartments(data)
        }
      } catch (err) {
        console.error("Failed to fetch departments", err)
      }
    }
    fetchDepartments()
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Full name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Must be 8+ characters"
    if (formData.password !== formData.confirm) newErrors.confirm = "Passwords do not match"
    if (!formData.rollNumber) newErrors.rollNumber = "Roll number is required"
    if (!formData.departmentId) newErrors.departmentId = "Department is required"
    if (!formData.semester) newErrors.semester = "Semester is required"
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
      const user = await authService.register(formData.email, formData.password, formData.name)
      
      // Store additional details in Supabase 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: formData.email, 
          account_type: "Student",
          first_name: formData.name.split(" ")[0],
          last_name: formData.name.split(" ").slice(1).join(" "),
          full_name: formData.name,
          roll_number: formData.rollNumber,
          department_id: formData.departmentId,
          semester: parseInt(formData.semester)
        }])

      if (profileError) throw profileError

      const u = { firstName: formData.name, lastName: "", email: formData.email, image: "", accountType: "Student" }
      dispatch(setUser(u))
      toast.success("Signup Successful! Please verify your email.")
      navigate("/dashboard/my-profile")
    } catch (e) {
      toast.error(e.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const googleSignup = async () => {
    try {
      setLoading(true)
      await authService.signInWithGoogle("Student")
    } catch (e) {
      toast.error(e.message || "Google signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-canvas px-4">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-surface p-6 sm:p-8 rounded-xl shadow-sm border border-border"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text tracking-tight">Student Registration</h1>
          <p className="mt-1 text-muted text-xs">Create your student profile and access coursework</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                className={`input-field ${errors.name ? 'border-danger focus:border-danger' : ''}`}
                placeholder="Ada Lovelace"
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
                placeholder="ada@example.com"
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
              <label className="block text-xs font-medium text-text mb-1.5">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                className={`input-field ${errors.rollNumber ? 'border-danger focus:border-danger' : ''}`}
                placeholder="CS2026-001"
                value={formData.rollNumber}
                onChange={handleInputChange}
              />
              {errors.rollNumber && <p className="mt-1 text-[11px] text-danger">{errors.rollNumber}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Semester</label>
              <select
                name="semester"
                className={`input-field ${errors.semester ? 'border-danger focus:border-danger' : ''}`}
                value={formData.semester}
                onChange={handleInputChange}
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              {errors.semester && <p className="mt-1 text-[11px] text-danger">{errors.semester}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Department</label>
              <select
                name="departmentId"
                className={`input-field ${errors.departmentId ? 'border-danger focus:border-danger' : ''}`}
                value={formData.departmentId}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                ))}
              </select>
              {errors.departmentId && <p className="mt-1 text-[11px] text-danger">{errors.departmentId}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1.5">Primary Focus / Interests</label>
              <input
                type="text"
                name="interests"
                className="input-field"
                placeholder="Systems, AI, Algorithms"
                value={formData.interests}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Complete Student Registration</span>
                <FaUserPlus className="text-xs" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-border">
          <button 
            type="button"
            onClick={googleSignup} 
            className="w-full btn-secondary flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold"
          >
            <FaGoogle className="text-danger" /> 
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

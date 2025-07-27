import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { useTranslation } from "../../utils/translations";
import { mockUsers, teams } from "../../utils/mockData";
import Input from "../Common/Input";
import Button from "../Common/Button";
import Card from "../Common/Card";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user by email
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (!user) {
        throw new Error(t("invalidCredentials"));
      }

      // For demo purposes, accept any password for existing users
      // In a real app, you would verify the password hash
      if (formData.password.length < 3) {
        throw new Error(t("invalidCredentials"));
      }

      // Determine user role and team
      let role = user.role;
      let teamId = null;

      // Special case: Make sarah.wilson@example.com access admin dashboard like john@example.com
      if (user.email.toLowerCase() === "sarah.wilson@example.com") {
        role = "admin";
        teamId = null; // Admins don't need team filtering
      } else if (user.role === "account_manager") {
        teamId = user.teamId;
      }

      // Dispatch success with user data
      dispatch(
        loginSuccess({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            department: user.department,
            position: user.position,
          },
          role,
          teamId,
        })
      );

      // Show success message based on role
      if (role === "account_manager") {
        const team = teams.find((t) => t.id === teamId);
        toast.success(
          `${t("welcome")} ${user.name}! ${t("managing")} ${team?.name}`,
          {
            icon: "👋",
            style: {
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
              color: "#fff",
            },
          }
        );
      } else if (role === "admin") {
        toast.success(`${t("welcome")} ${user.name}! ${t("adminAccess")}`, {
          icon: "👑",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
            color: "#fff",
          },
        });
      } else {
        toast.success(`${t("welcome")} ${user.name}!`, {
          icon: "🎉",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error(error.message, {
        icon: "❌",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-4">
      <Card className="w-full max-w-md animate-bounce-in">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-accent-500 to-info-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                T
              </div>
              <SparklesIcon className="h-6 w-6 text-accent-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("loginTitle")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Demo Accounts Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Demo Accounts:
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <div>
                <strong>Admin:</strong> john@example.com
              </div>
              <div>
                <strong>Account Manager:</strong> sarah.wilson@example.com
              </div>
              <div>
                <strong>Employee:</strong> jane@example.com
              </div>
              <div>
                <strong>Password:</strong> any password (3+ chars)
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Input
                label={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t("enterEmail")}
                error={errors.email}
                icon={<EnvelopeIcon className="h-5 w-5" />}
                className="w-full"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  label={t("password")}
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={t("enterPassword")}
                  error={errors.password}
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  className="w-full pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? t("loggingIn") : t("login")}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("demoMode")} - {t("useAnyPassword")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;

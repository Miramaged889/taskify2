
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "../../../utils/translations";
import Input from "../../Common/Input";
import Select from "../../Common/Select";
import Button from "../../Common/Button";

const TeamMemberForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  mode,
}) => {
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const roleOptions = [
    { value: "employee", label: t("employee") },
    { value: "admin", label: t("admin") },
  ];

  const departmentOptions = [
    { value: "development", label: t("development") },
    { value: "design", label: t("design") },
    { value: "marketing", label: t("marketing") },
    { value: "sales", label: t("sales") },
    { value: "hr", label: t("humanResources") },
    { value: "finance", label: t("finance") },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label={t("name")}
        value={formData.name}
        onChange={(value) => onChange("name", value)}
        error={errors.name}
        required
      />

      <Input
        label={t("email")}
        type="email"
        value={formData.email}
        onChange={(value) => onChange("email", value)}
        error={errors.email}
        required
      />

      <Input
        label={t("phone")}
        type="tel"
        value={formData.phone}
        onChange={(value) => onChange("phone", value)}
        error={errors.phone}
      />

      <Select
        label={t("role")}
        value={formData.role}
        options={roleOptions}
        onChange={(value) => onChange("role", value)}
        error={errors.role}
      />

      <Select
        label={t("department")}
        value={formData.department}
        options={departmentOptions}
        onChange={(value) => onChange("department", value)}
        error={errors.department}
      />

      <Input
        label={t("position")}
        value={formData.position}
        onChange={(value) => onChange("position", value)}
        error={errors.position}
      />

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {mode === "create" ? t("add") : t("update")} {t("member")}
        </Button>
      </div>
    </form>
  );
};

TeamMemberForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    role: PropTypes.string.isRequired,
    department: PropTypes.string,
    position: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
};

export default TeamMemberForm;

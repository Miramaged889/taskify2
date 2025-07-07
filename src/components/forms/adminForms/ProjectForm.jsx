import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "../../../utils/translations";
import Input from "../../Common/Input";
import Textarea from "../../Common/Textarea";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Button from "../../Common/Button";
import Avatar from "../../Common/Avatar";

const ProjectForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onTeamMemberToggle,
  mode,
}) => {
  const { members } = useSelector((state) => state.team);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const statusOptions = [
    { value: "planning", label: t("planning") },
    { value: "progress", label: t("progress") },
    { value: "completed", label: t("completed") },
    { value: "on-hold", label: t("onHold") },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label={t("projectName")}
        value={formData.name}
        onChange={(value) => onChange("name", value)}
        error={errors.name}
        required
      />

      <Textarea
        label={t("description")}
        value={formData.description}
        onChange={(value) => onChange("description", value)}
        error={errors.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          label={t("startDate")}
          selected={formData.startDate}
          onChange={(date) => onChange("startDate", date)}
          error={errors.startDate}
        />

        <DatePicker
          label={t("endDate")}
          selected={formData.endDate}
          onChange={(date) => onChange("endDate", date)}
          error={errors.endDate}
          minDate={formData.startDate}
        />
      </div>

      <Select
        label={t("status")}
        value={formData.status}
        options={statusOptions}
        onChange={(value) => onChange("status", value)}
        error={errors.status}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("teamMembers")}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`
                flex items-center p-2 rounded-lg cursor-pointer transition-colors
                ${
                  formData.teamMembers.includes(member.id)
                    ? "bg-primary-50 dark:bg-primary-900"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
              onClick={() => onTeamMemberToggle(member.id)}
            >
              <Avatar
                name={member.name}
                src={member.avatar}
                size="small"
                className="mr-2"
              />
              <span className="text-sm truncate">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {mode === "create" ? t("create") : t("update")} {t("project")}
        </Button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    status: PropTypes.string.isRequired,
    teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onTeamMemberToggle: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
};

export default ProjectForm;

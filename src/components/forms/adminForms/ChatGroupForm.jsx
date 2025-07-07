import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import Select from "../../Common/Select";
import { useTranslation } from "../../../utils/translations";

const ChatGroupForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onMemberToggle,
  mode = "create",
}) => {
  const { members } = useSelector((state) => state.team);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          label={t("groupName")}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
          required
        />
      </div>

      <div>
        <Input
          label={t("description")}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          error={errors.description}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("members")}
        </label>
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={formData.members.includes(member.id)}
                onChange={() => onMemberToggle(member.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`member-${member.id}`}
                className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
              >
                {member.name}
              </label>
            </div>
          ))}
        </div>
        {errors.members && (
          <p className="mt-1 text-sm text-error-600">{errors.members}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {mode === "create" ? t("createGroup") : t("updateGroup")}
        </Button>
      </div>
    </form>
  );
};

ChatGroupForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    members: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onMemberToggle: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
};

export default ChatGroupForm;

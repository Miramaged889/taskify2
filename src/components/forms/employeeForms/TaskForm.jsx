import { useSelector } from "react-redux";
import { useTranslation } from "../../../utils/translations";
import Input from "../../Common/Input";
import Textarea from "../../Common/Textarea";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Button from "../../Common/Button";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { PropTypes } from "prop-types";

const TaskForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onAssigneeChange,
  mode,
}) => {
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  // const isRTL = language === "ar";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label={t("taskTitle")}
        value={formData.title}
        onChange={(e) => onChange("title", e.target.value)}
        error={errors.title}
        required
      />

      <Textarea
        label={t("description")}
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={4}
      />

      <Select
        label={t("project")}
        value={formData.project}
        onChange={(value) => onChange("project", value)}
        error={errors.project}
        required
        options={[
          { value: "1", label: "Project A" },
          { value: "2", label: "Project B" },
          { value: "3", label: "Project C" },
        ]}
      />

      <Select
        label={t("assignee")}
        value={formData.assignee}
        onChange={onAssigneeChange}
        error={errors.assignee}
        required
        options={[
          { value: "1", label: "John Doe" },
          { value: "2", label: "Jane Smith" },
          { value: "3", label: "Bob Johnson" },
        ]}
      />

      <DatePicker
        label={t("dueDate")}
        selected={formData.dueDate}
        onChange={(date) => onChange("dueDate", date)}
      />

      <Select
        label={t("priority")}
        value={formData.priority}
        onChange={(value) => onChange("priority", value)}
        options={[
          { value: "low", label: t("low") },
          { value: "medium", label: t("medium") },
          { value: "high", label: t("high") },
        ]}
      />

      <Select
        label={t("status")}
        value={formData.status}
        onChange={(value) => onChange("status", value)}
        options={[
          { value: "todo", label: t("todo") },
          { value: "in_progress", label: t("inProgress") },
          { value: "done", label: t("done") },
        ]}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : mode === "create" ? (
            t("createTask")
          ) : (
            t("updateTask")
          )}
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAssigneeChange: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
};

TaskForm.defaultProps = {
  formData: {},
  errors: {},
  loading: false,
  onSubmit: () => {},
  onChange: () => {},
  onAssigneeChange: () => {},
  mode: "create",
};
export default TaskForm;

import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Textarea from "../../Common/Textarea";
import { useTranslation } from "../../../utils/translations";

const TaskForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onAssigneeChange,
  mode = "create",
}) => {
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const priorityOptions = [
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
  ];

  const statusOptions = [
    { value: "todo", label: t("todo") },
    { value: "in_progress", label: t("inProgress") },
    { value: "review", label: t("review") },
    { value: "done", label: t("done") },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          label={t("taskTitle")}
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          error={errors.title}
          required
        />
      </div>

      <div>
        <Textarea
          label={t("description")}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          error={errors.description}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select
            label={t("project")}
            value={formData.project}
            onChange={(value) => onChange("project", value)}
            options={projects.map((project) => ({
              value: project.id,
              label: project.name,
            }))}
            error={errors.project}
          />
        </div>

        <div>
          <Select
            label={t("assignee")}
            value={formData.assignee}
            onChange={(value) => onAssigneeChange(value)}
            options={members.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
            error={errors.assignee}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DatePicker
            label={t("dueDate")}
            selected={formData.dueDate}
            onChange={(date) => onChange("dueDate", date)}
            error={errors.dueDate}
          />
        </div>

        <div>
          <Select
            label={t("priority")}
            value={formData.priority}
            onChange={(value) => onChange("priority", value)}
            options={priorityOptions}
            error={errors.priority}
          />
        </div>
      </div>

      {mode === "edit" && (
        <div>
          <Select
            label={t("status")}
            value={formData.status}
            onChange={(value) => onChange("status", value)}
            options={statusOptions}
            error={errors.status}
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {mode === "create" ? t("createTask") : t("updateTask")}
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    project: PropTypes.string.isRequired,
    assignee: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date),
    priority: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    project: PropTypes.string,
    assignee: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAssigneeChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
};

export default TaskForm;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask } from '../../store/slices/taskSlice';
import { useTranslation } from '../../utils/translations';
import { generateId, validateRequired } from '../../utils/helpers';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../utils/constants';
import Modal from '../Common/Modal';
import Input from '../Common/Input';
import Textarea from '../Common/Textarea';
import Select from '../Common/Select';
import DatePicker from '../Common/DatePicker';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, task, mode = 'create' }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.settings);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    project: '',
    dueDate: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        project: task.project || '',
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: '',
        project: '',
        dueDate: null,
      });
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.title)) {
      newErrors.title = t('requiredField');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
      
      if (mode === 'create') {
        taskData.id = generateId();
        taskData.createdAt = new Date().toISOString();
        taskData.createdBy = '1'; // Current user ID
        
        dispatch(addTask(taskData));
        toast.success(t('taskCreated'));
      } else {
        taskData.id = task.id;
        taskData.createdAt = task.createdAt;
        taskData.createdBy = task.createdBy;
        
        dispatch(updateTask(taskData));
        toast.success(t('taskUpdated'));
      }
      
      onClose();
    } catch (error) {
      toast.error(t('serverError'));
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = Object.values(TASK_STATUSES).map(status => ({
    value: status,
    label: t(status),
  }));

  const priorityOptions = Object.values(TASK_PRIORITIES).map(priority => ({
    value: priority,
    label: t(priority),
  }));

  const assigneeOptions = members.map(member => ({
    value: member.id,
    label: member.name,
  }));

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? `${t('add')} ${t('task')}` : `${t('edit')} ${t('task')}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {t('save')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('taskTitle')}
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <Textarea
          label={t('taskDescription')}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('taskStatus')}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            required
          />

          <Select
            label={t('taskPriority')}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            options={priorityOptions}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('taskAssignee')}
            value={formData.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            options={assigneeOptions}
            placeholder={t('selectAssignee')}
          />

          <Select
            label={t('taskProject')}
            value={formData.project}
            onChange={(e) => handleChange('project', e.target.value)}
            options={projectOptions}
            placeholder={t('selectProject')}
          />
        </div>

        <DatePicker
          label={t('taskDueDate')}
          selected={formData.dueDate}
          onChange={(date) => handleChange('dueDate', date)}
          minDate={new Date()}
        />
      </form>
    </Modal>
  );
};

export default TaskModal;
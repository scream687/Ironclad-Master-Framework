import { Task } from '../../entities/task.entity';
import { Priority } from '../../value-objects/priority.vo';
import { TaskAssignedEvent } from '../../events/task-assigned.event';

describe('Task Entity', () => {
  let task: Task;

  beforeEach(() => {
    task = Task.create('Test task', Priority.medium());
  });

  describe('creation', () => {
    it('should create task with pending status', () => {
      expect(task.status.isPending()).toBe(true);
      expect(task.description).toBe('Test task');
      expect(task.priority.equals(Priority.medium())).toBe(true);
    });

    it('should generate unique ID', () => {
      const task1 = Task.create('Task 1', Priority.low());
      const task2 = Task.create('Task 2', Priority.low());

      expect(task1.id.equals(task2.id)).toBe(false);
    });
  });

  describe('assignment', () => {
    it('should assign to agent and change status', () => {
      const agentId = 'agent-123';

      task.assignTo(agentId);

      expect(task.assignedAgentId).toBe(agentId);
      expect(task.status.isAssigned()).toBe(true);
    });

    it('should emit TaskAssignedEvent when assigned', () => {
      const agentId = 'agent-123';

      task.assignTo(agentId);

      const events = task.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TaskAssignedEvent);
    });

    it('should not allow assignment of completed task', () => {
      task.assignTo('agent-123');
      task.complete({ success: true, message: 'done' });

      expect(() => task.assignTo('agent-456'))
        .toThrow('Cannot assign completed task');
    });
  });
});

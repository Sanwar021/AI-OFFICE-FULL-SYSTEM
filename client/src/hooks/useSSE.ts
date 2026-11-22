import { useEffect } from 'react';
import { useOfficeStore } from '../store/useOfficeStore';

export function useSSE() {
  const updateEmployeeStatus = useOfficeStore((state) => state.updateEmployeeStatus);
  const updateEmployeeMonitor = useOfficeStore((state) => state.updateEmployeeMonitor);
  const appendTaskStream = useOfficeStore((state) => state.appendTaskStream);
  const addTask = useOfficeStore((state) => state.addTask);
  const updateTask = useOfficeStore((state) => state.updateTask);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    function connect() {
      eventSource = new EventSource('/events');

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;

          if (type === 'task_chunk') {
            appendTaskStream(data.chunk);
            updateEmployeeMonitor(data.employeeId, data.chunk);
          } else if (type === 'employee_update') {
            updateEmployeeStatus(data.id, data.status, data.animationState);
          } else if (type === 'task_update') {
            updateTask(data.id, data);
          } else if (type === 'task_created') {
            addTask(data);
          } else if (type === 'handoff_start') {
            // Trigger 3D document handoff: Employee walks to target colleague
            updateEmployeeStatus(data.sourceEmployeeId, 'working', 'delivering');
            setTimeout(() => {
              updateEmployeeStatus(data.sourceEmployeeId, 'idle', 'idle');
              updateEmployeeStatus(data.targetEmployeeId, 'working', 'typing');
            }, 3500);
          }
        } catch {
          // ignore
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        reconnectTimeout = setTimeout(connect, 3000);
      };
    }

    connect();

    // Initial fetch of tasks and employees from database
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (data.tasks) {
          data.tasks.forEach((t: any) => addTask(t));
        }
      })
      .catch(() => {});

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);
}

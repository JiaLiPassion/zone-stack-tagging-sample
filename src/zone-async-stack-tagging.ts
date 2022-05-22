interface Console {
  scheduleAsyncTask(name: string): number;
  startAsyncTask(task: number): void;
  finishAsyncTask(task: number): void;
  cancelAsyncTask(task: number): void;
}

interface Task {
  id?: number;
}

class AsyncStackTaggingZoneSpec implements ZoneSpec {
  runZone = Zone.current;
  xhrStacks: Task[] = [];

  constructor(namePrefix: string) {
    this.name = 'asyncStackTagging for ' + namePrefix;
  }

  // ZoneSpec implementation below.

  name: string;

  onScheduleTask(
    delegate: ZoneDelegate,
    current: Zone,
    target: Zone,
    task: Task
  ): Task {
    if (task.source === 'XMLHttpRequest.addEventListener:load') {
      return delegate.scheduleTask(target, task);
    }
    task.id =
      console.scheduleAsyncTask &&
      console.scheduleAsyncTask(task.source || task.type);
    if (task.source === 'XMLHttpRequest.send') {
      this.xhrStacks.push(task);
    }
    return delegate.scheduleTask(target, task);
  }

  onInvokeTask(
    delegate: ZoneDelegate,
    currentZone: Zone,
    targetZone: Zone,
    task: Task,
    applyThis: any,
    applyArgs?: any[]
  ) {
    let asyncTaggingTask = task;
    if (task.source === 'XMLHttpRequest.send') {
      return delegate.invokeTask(targetZone, task, applyThis, applyArgs);
    }
    if (task.source === 'XMLHttpRequest.addEventListener:load') {
      const target = (task as any).target;
      for (let i = 0; i < this.xhrStacks.length; i++) {
        const xhrTask = this.xhrStacks[i];
        const xhr = (xhrTask.data as any)?.target;
        if (target === xhr) {
          this.xhrStacks.splice(i, 1);
          asyncTaggingTask = xhrTask;
          break;
        }
      }
    }
    asyncTaggingTask.id &&
      console.startAsyncTask &&
      console.startAsyncTask(asyncTaggingTask.id);

    const r = delegate.invokeTask(targetZone, task, applyThis, applyArgs);

    if (
      task.type !== 'eventTask' &&
      task.type === 'macroTask' &&
      !task.data?.isPeriodic
    ) {
      asyncTaggingTask.id &&
        console.finishAsyncTask &&
        console.finishAsyncTask(asyncTaggingTask.id);
    }
    return r;
  }

  onCancelTask(
    delegate: ZoneDelegate,
    currentZone: Zone,
    targetZone: Zone,
    task: Task
  ) {
    task.id && console.cancelAsyncTask && console.cancelAsyncTask(task.id);
    task.id = undefined;
    return delegate.cancelTask(targetZone, task);
  }
}

// Export the class so that new instances can be created with proper
// constructor params.
(Zone as any)['AsyncStackTaggingZoneSpec'] = AsyncStackTaggingZoneSpec;

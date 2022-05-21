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
    task.id =
      console.scheduleAsyncTask &&
      console.scheduleAsyncTask(task.source || task.type);
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
    task.id && console.startAsyncTask && console.startAsyncTask(task.id);
    const r = delegate.invokeTask(targetZone, task, applyThis, applyArgs);
    task.id && console.finishAsyncTask && console.finishAsyncTask(task.id);
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

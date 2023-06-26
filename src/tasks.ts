import {Context} from './context'
import {JobDetails} from './types'
import {waitFor} from './utils'

const getTaskName = (taskName?: string) => {
  switch (taskName) {
    case 'gh-validation':
      return 'Fetching Metadata'
    case 'parse-metadata-migration':
      return 'Parsing metadata and migrations'
    case 'parse-migration':
      return 'Parsing migrations'
    case 'parse-metadata':
      return 'Parsing metadata'
    case 'apply-metadata':
      return 'Applying metadata'
    case 'apply-migration':
      return 'Applying migrations'
    case 'reload-metadata':
      return 'Refreshing metadata'
    case 'check-healthz':
      return 'Checking Project Health'
    default:
      return null
  }
}

const getTaskStatus = (status: string) => {
  if (status === 'created') {
    return 'started'
  }
  return status
}

const getJobStatus = async (jobId: string, context: Context) => {
  context.logger.log(`jobId - ${jobId}`)
  try {
    const resp = await context.client.query<JobDetails, {jobId: string}>({
      query: `
        query getJobStatus($jobId: uuid!) {
          jobs_by_pk(id: $jobId) {
            status
            tasks(order_by: { updated_at: asc }) {
              id
              name
              cloud
              region task_events(order_by: { updated_at: desc }, limit: 1) {
                event_type
                id
                error
                github_detail
              }
            }
          }
        }
      `,
      variables: {
        jobId
      }
    })
    if (!resp.jobs_by_pk) {
      throw new Error(
        'could not find the GitHub job; the associated deployment was terminated'
      )
    }
    const tasksCount = resp.jobs_by_pk?.tasks.length
    if (tasksCount && tasksCount > 0) {
      const latestTask = resp.jobs_by_pk?.tasks[tasksCount - 1]
      const taskEventsCount = latestTask?.task_events.length
      if (latestTask && taskEventsCount && taskEventsCount > 0) {
        const latestTaskEvent = latestTask.task_events[taskEventsCount - 1]
        context.logger.log(
          `${getTaskName(latestTask.name)}: ${getTaskStatus(
            latestTaskEvent?.event_type
          )}`,
          false
        )
        if (latestTaskEvent?.github_detail) {
          context.logger.log(latestTaskEvent?.github_detail, false)
        }
        if (
          latestTaskEvent &&
          latestTaskEvent.event_type === 'failed' &&
          latestTaskEvent.error
        ) {
          context.logger.log(latestTaskEvent?.error, false)
        }
      }
    }
    return resp.jobs_by_pk.status
  } catch (e) {
    if (e instanceof Error) {
      context.logger.log(e.message)
    }
    throw e
  }
}

export const getRealtimeLogs = async (
  jobId: string,
  context: Context,
  retryCount = 0
) => {
  context.logger.log(`getRealtimeLogs - ${jobId}`)
  if (retryCount > 0) {
    await waitFor(2000)
  }
  const jobStatus = await getJobStatus(jobId, context)
  if (jobStatus === 'success') {
    return 'success'
  }
  if (jobStatus === 'failed') {
    return 'failed'
  }
  return getRealtimeLogs(jobId, context, retryCount + 1)
}

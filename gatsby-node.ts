import type { GatsbyNode } from "gatsby"

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
const EXPECTED_GITHUB_LOGIN = process.env.GITHUB_LOGIN ?? "gus-vasquez"
const NODE_TYPE = "GithubContributionCalendar"

type ContributionDay = {
  date: string
  color: string
  contributionCount: number
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"
}

type ContributionWeek = {
  firstDay: string
  contributionDays: ContributionDay[]
}

type ContributionCalendar = {
  totalContributions: number
  weeks: ContributionWeek[]
}

type ContributionCollection = {
  startedAt: string
  endedAt: string
  hasAnyRestrictedContributions: boolean
  restrictedContributionsCount: number
  totalCommitContributions: number
  totalPullRequestContributions: number
  totalPullRequestReviewContributions: number
  totalIssueContributions: number
  contributionCalendar: ContributionCalendar
}

type ContributionResponse = {
  data?: {
    viewer?: {
      login: string
      contributionsCollection?: ContributionCollection
    }
  }
  errors?: Array<{ message?: string }>
}

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const token = process.env.GITHUB_CONTRIBUTIONS_TOKEN ?? process.env.GH_CONTRIBUTIONS_TOKEN

  if (!token) {
    reporter.warn(
      "[github-contributions] Missing GITHUB_CONTRIBUTIONS_TOKEN (or GH_CONTRIBUTIONS_TOKEN) env var. Skipping contributions sourcing.",
    )
    return
  }

  let response: Response

  try {
    const now = new Date()
    const to = now.toISOString()
    const fromDate = new Date(now)
    fromDate.setUTCDate(fromDate.getUTCDate() - 371)
    const from = fromDate.toISOString()

    response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($from: DateTime!, $to: DateTime!) {
            viewer {
              login
              contributionsCollection(from: $from, to: $to) {
                startedAt
                endedAt
                hasAnyRestrictedContributions
                restrictedContributionsCount
                totalCommitContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
                totalIssueContributions
                contributionCalendar {
                  totalContributions
                  weeks {
                    firstDay
                    contributionDays {
                      date
                      color
                      contributionCount
                      contributionLevel
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          from,
          to,
        },
      }),
    })
  } catch (error) {
    reporter.panicOnBuild(
      `[github-contributions] Failed to contact GitHub GraphQL API: ${(error as Error).message}`,
    )
    return
  }

  if (!response.ok) {
    reporter.panicOnBuild(
      `[github-contributions] Non-OK response from GitHub GraphQL API: ${response.status} ${response.statusText}`,
    )
    return
  }

  let payload: ContributionResponse

  try {
    payload = (await response.json()) as ContributionResponse
  } catch (error) {
    reporter.panicOnBuild(
      `[github-contributions] Failed to parse GitHub response JSON: ${(error as Error).message}`,
    )
    return
  }

  if (payload.errors && payload.errors.length > 0) {
    const messages = payload.errors.map((err) => err.message).join("; ")
    reporter.panicOnBuild(`[github-contributions] GraphQL errors: ${messages}`)
    return
  }

  const viewer = payload.data?.viewer
  const collection = viewer?.contributionsCollection
  const calendar = collection?.contributionCalendar
  const viewerLogin = viewer?.login
  const restrictedCount = collection?.restrictedContributionsCount ?? 0

  if (!calendar) {
    reporter.warn("[github-contributions] No contribution calendar data returned.")
    return
  }

  const nodeData = {
    id: createNodeId("github-contribution-calendar"),
    login: viewerLogin ?? EXPECTED_GITHUB_LOGIN,
    totalContributions: calendar.totalContributions,
    totalCommitContributions: collection?.totalCommitContributions ?? 0,
    totalPullRequestContributions: collection?.totalPullRequestContributions ?? 0,
    totalPullRequestReviewContributions: collection?.totalPullRequestReviewContributions ?? 0,
    totalIssueContributions: collection?.totalIssueContributions ?? 0,
    restrictedContributionsCount: restrictedCount,
    hasAnyRestrictedContributions: collection?.hasAnyRestrictedContributions ?? false,
    weeks: calendar.weeks.map((week) => ({
      firstDay: week.firstDay,
      contributionDays: week.contributionDays.map((day) => ({
        date: day.date,
        color: day.color,
        contributionCount: day.contributionCount,
        contributionLevel: day.contributionLevel,
      })),
    })),
    updatedAt: new Date().toISOString(),
  }

  actions.createNode({
    ...nodeData,
    internal: {
      type: NODE_TYPE,
      contentDigest: createContentDigest(nodeData),
    },
  })

  if (viewerLogin && viewerLogin !== EXPECTED_GITHUB_LOGIN) {
    reporter.warn(
      `[github-contributions] Viewer login "${viewerLogin}" does not match expected "${EXPECTED_GITHUB_LOGIN}".`,
    )
  }

  reporter.info(
    `[github-contributions] Sourced ${calendar.totalContributions} contributions for ${viewerLogin ?? EXPECTED_GITHUB_LOGIN}`,
  )

  if (nodeData.hasAnyRestrictedContributions) {
    reporter.info(
      `[github-contributions] Restricted contributions reported: ${restrictedCount}. If the calendar still shows fewer contributions than expected, verify the PAT has 'repo' + 'read:user' scopes and is SSO-authorized for all relevant organizations.`,
    )
  }

  reporter.info(
    `[github-contributions] Breakdown — commits: ${nodeData.totalCommitContributions}, PRs: ${nodeData.totalPullRequestContributions}, reviews: ${nodeData.totalPullRequestReviewContributions}, issues: ${nodeData.totalIssueContributions}, restricted: ${restrictedCount}`,
  )
}

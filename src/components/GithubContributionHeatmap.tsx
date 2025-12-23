import * as React from "react"
import { Box, Flex, Text, useThemeUI, useColorMode } from "theme-ui"

export type ContributionDay = {
  date: string
  color?: string
  contributionCount: number
  contributionLevel?: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE"
}

export type ContributionWeek = {
  firstDay: string
  contributionDays: ContributionDay[]
}

export type ContributionCalendar = {
  totalContributions: number
  weeks: ContributionWeek[]
  updatedAt?: string
  login?: string
  totalCommitContributions?: number
  totalPullRequestContributions?: number
  totalPullRequestReviewContributions?: number
  totalIssueContributions?: number
  restrictedContributionsCount?: number
  hasAnyRestrictedContributions?: boolean
}

type GithubContributionHeatmapProps = {
  calendar: ContributionCalendar
}

const CELL_SIZE = 12
const CELL_GAP = 3
const MAX_ROWS = 7
const LABEL_GUTTER = 32
const TOP_MARGIN = 20
const BOTTOM_GAP = 22
const MONTH_LABEL_FONT_SIZE = 10
const DAY_LABEL_FONT_SIZE = 10
const LEGEND_BOX_SIZE = 10
const LEGEND_GAP = 2
const LEGEND_LABEL_GAP = 6
const LEGEND_TEXT_WIDTH = 22
const DAY_LABELS = [
  { index: 1, label: "Mon" },
  { index: 3, label: "Wed" },
  { index: 5, label: "Fri" },
]

const GITHUB_LIGHT_PALETTE = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
const GITHUB_DARK_PALETTE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
const CONTRIBUTION_LEVEL_TO_INDEX: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

type TooltipState = {
  left: number
  top: number
  date: string
  count: number
}

const formattedDate = (date: string): string => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  const isoDate = date.includes("T") ? date : `${date}T00:00:00Z`

  return formatter.format(new Date(isoDate))
}

const GithubContributionHeatmap: React.FC<GithubContributionHeatmapProps> = ({ calendar }) => {
  const { theme } = useThemeUI()
  const [colorMode] = useColorMode()
  const chartWrapperRef = React.useRef<HTMLDivElement | null>(null)
  const [tooltip, setTooltip] = React.useState<TooltipState | null>(null)
  const weeks = calendar.weeks ?? []
  const chartWidth = Math.max(weeks.length * (CELL_SIZE + CELL_GAP) - CELL_GAP, 0)
  const chartHeight = MAX_ROWS * (CELL_SIZE + CELL_GAP) - CELL_GAP
  const svgWidth = LABEL_GUTTER + chartWidth
  const svgHeight = TOP_MARGIN + chartHeight + BOTTOM_GAP
  const isDarkMode = colorMode === "dark"
  const colorScale = React.useMemo(() => (isDarkMode ? GITHUB_DARK_PALETTE : GITHUB_LIGHT_PALETTE), [isDarkMode])
  const emptyColor = colorScale[0]
  const themeColors = (theme?.colors ?? {}) as Record<string, unknown> & {
    modes?: Record<string, Record<string, unknown>>
  }
  const activeColors = isDarkMode
    ? (themeColors.modes?.dark as Record<string, unknown> | undefined)
    : (themeColors as Record<string, unknown>)
  const getColorValue = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined)
  const axisColor = isDarkMode ? "#8b949e" : "#1f2328"
  const headingColor =
    getColorValue(activeColors?.heading) ?? (isDarkMode ? "#f0f6fc" : "#1f2328")
  const secondaryTextColor =
    getColorValue(activeColors?.textMuted) ??
    getColorValue(activeColors?.muted) ??
    (isDarkMode ? "#c9d1d9" : "#57606a")
  const profileUrl = React.useMemo(() => {
    const login = calendar.login?.trim()
    return login ? `https://github.com/${login}` : "https://github.com/"
  }, [calendar.login])
  const formatContributionCount = React.useCallback(
    (count: number) => (count === 1 ? "1 contribution" : `${count} contributions`),
    [],
  )
  const showTooltip = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>, day: ContributionDay) => {
      const containerRect = chartWrapperRef.current?.getBoundingClientRect()
      if (!containerRect) {
        return
      }

      const targetRect = event.currentTarget.getBoundingClientRect()
      const scrollLeft = chartWrapperRef.current?.scrollLeft ?? 0
      const scrollTop = chartWrapperRef.current?.scrollTop ?? 0
      const translateLeft = event.clientX - containerRect.left + scrollLeft
      const targetTop = targetRect.top - containerRect.top + scrollTop

      setTooltip({
        left: translateLeft,
        top: targetTop,
        date: day.date,
        count: day.contributionCount,
      })
    },
    [],
  )
  const hideTooltip = React.useCallback(() => {
    setTooltip(null)
  }, [])

  const { maxContribution, totalFromDays } = React.useMemo(() => {
    let max = 0
    let total = 0
    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        total += day.contributionCount
        if (day.contributionCount > max) {
          max = day.contributionCount
        }
      })
    })
    return { maxContribution: max, totalFromDays: total }
  }, [weeks])

  const resolveColor = React.useCallback(
    (day: ContributionDay) => {
      if (!colorScale.length) {
        return "#d0d7de"
      }

      const levelIndex =
        (day.contributionLevel && CONTRIBUTION_LEVEL_TO_INDEX[day.contributionLevel]) ?? undefined

      if (typeof levelIndex === "number") {
        return colorScale[Math.min(levelIndex, colorScale.length - 1)]
      }

      if (day.contributionCount <= 0 || maxContribution === 0) {
        return emptyColor
      }

      const levels = Math.max(1, colorScale.length - 1)
      const scaled = Math.ceil((day.contributionCount / maxContribution) * levels)
      const bucket = Math.max(1, Math.min(levels, scaled))

      return colorScale[bucket]
    },
    [colorScale, emptyColor, maxContribution],
  )

  const monthLabels = React.useMemo(() => {
    const labels: Array<{ x: number; label: string }> = []
    let lastMonth = -1

    weeks.forEach((week, weekIndex) => {
      const firstDay = new Date(week.firstDay)
      const month = firstDay.getUTCMonth()
      if (month !== lastMonth) {
        labels.push({
          x: LABEL_GUTTER + weekIndex * (CELL_SIZE + CELL_GAP),
          label: firstDay.toLocaleString("en-US", { month: "short" }),
        })
        lastMonth = month
      }
    })

    return labels
  }, [weeks])

  const legendColorWidth =
    colorScale.length * LEGEND_BOX_SIZE + Math.max(0, colorScale.length - 1) * LEGEND_GAP
  const legendContentWidth = LEGEND_TEXT_WIDTH * 2 + legendColorWidth + LEGEND_LABEL_GAP * 2
  const legendX = LABEL_GUTTER + Math.max(0, chartWidth - legendContentWidth)
  const legendBaseline = svgHeight - BOTTOM_GAP / 2

  if (weeks.length === 0) {
    return (
      <Box>
        <Text sx={{ fontSize: 1, color: "muted" }}>No contribution data available.</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Flex sx={{ alignItems: "baseline", justifyContent: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Text as="h2" sx={{ fontSize: [2, 3], fontWeight: "bold", color: headingColor }}>
          GitHub Activity
        </Text>
      </Flex>

      <Box ref={chartWrapperRef} sx={{ position: "relative" }}>
        <Box
          as="a"
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${calendar.login ?? "GitHub user"}'s profile on GitHub`}
          sx={{
            display: "block",
            color: "inherit",
            textDecoration: "none",
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: axisColor,
              outlineOffset: 4,
              borderRadius: 4,
            },
          }}
        >
          <Box
            sx={{
              overflowX: "auto",
              pb: 2,
            }}
          >
            <svg
              role="img"
              aria-label={`GitHub contributions heatmap for ${calendar.login ?? "GitHub user"}`}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              width="100%"
              preserveAspectRatio="xMinYMid meet"
              style={{ maxWidth: "100%" }}
            >
              <title>{`GitHub contributions for ${calendar.login ?? "GitHub user"}`}</title>
              <g aria-hidden="true">
                {monthLabels.map(({ x, label }) => (
                  <text
                    key={`month-${label}-${x}`}
                    x={x + CELL_SIZE / 2}
                    y={TOP_MARGIN / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={MONTH_LABEL_FONT_SIZE}
                    fill={axisColor}
                  >
                    {label}
                  </text>
                ))}
                {DAY_LABELS.map((day) => (
                  <text
                    key={`day-${day.label}`}
                    x={LABEL_GUTTER - 6}
                    y={TOP_MARGIN + day.index * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={DAY_LABEL_FONT_SIZE}
                    fill={axisColor}
                  >
                    {day.label}
                  </text>
                ))}
              </g>
              {weeks.map((week, weekIndex) =>
                week.contributionDays.map((day, dayIndex) => {
                  const x = LABEL_GUTTER + weekIndex * (CELL_SIZE + CELL_GAP)
                  const y = TOP_MARGIN + dayIndex * (CELL_SIZE + CELL_GAP)

                  return (
                    <rect
                      key={`${week.firstDay}-${day.date}`}
                      x={x}
                      y={y}
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      rx={2}
                      ry={2}
                      fill={resolveColor(day)}
                      data-count={day.contributionCount}
                      onMouseEnter={(event) => showTooltip(event, day)}
                      onMouseMove={(event) => showTooltip(event, day)}
                      onMouseLeave={hideTooltip}
                    >
                      <title>{`${day.contributionCount} contributions on ${formattedDate(day.date)}`}</title>
                    </rect>
                  )
                }),
              )}
              <g aria-hidden="true" transform={`translate(${legendX}, ${legendBaseline})`}>
                <text textAnchor="start" dominantBaseline="middle" fontSize={DAY_LABEL_FONT_SIZE} fill={axisColor}>
                  Less
                </text>
                <g transform={`translate(${LEGEND_TEXT_WIDTH + LEGEND_LABEL_GAP}, ${-LEGEND_BOX_SIZE / 2})`}>
                  {colorScale.map((color, index) => (
                    <rect
                      key={`legend-${index}`}
                      x={index * (LEGEND_BOX_SIZE + LEGEND_GAP)}
                      y={0}
                      width={LEGEND_BOX_SIZE}
                      height={LEGEND_BOX_SIZE}
                      rx={2}
                      ry={2}
                      fill={color}
                      stroke={color === emptyColor ? axisColor : "none"}
                    />
                  ))}
                </g>
                <text
                  x={LEGEND_TEXT_WIDTH + LEGEND_LABEL_GAP + legendColorWidth + LEGEND_LABEL_GAP}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontSize={DAY_LABEL_FONT_SIZE}
                  fill={axisColor}
                >
                  More
                </text>
              </g>
            </svg>
          </Box>
        </Box>
        {tooltip ? (
          <Box
            role="tooltip"
            sx={{
              position: "absolute",
              left: tooltip.left,
              top: tooltip.top,
              transform: "translate(-50%, calc(-100% - 8px))",
              backgroundColor: isDarkMode ? "rgba(22, 27, 34, 0.92)" : "rgba(255, 255, 255, 0.95)",
              color: isDarkMode ? "#f0f6fc" : "#1f2328",
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              pointerEvents: "none",
              fontSize: 0,
              zIndex: 1,
              whiteSpace: "nowrap",
            }}
          >
            <Text as="span" sx={{ fontSize: 0, m: 0 }}>
              {formatContributionCount(tooltip.count)} on {formattedDate(tooltip.date)}
            </Text>
          </Box>
        ) : null}
      </Box>

      {calendar.updatedAt ? (
        <Text sx={{ fontSize: 0, color: secondaryTextColor, mt: 2 }}>
          Updated {formattedDate(calendar.updatedAt)}
        </Text>
      ) : null}

    </Box>
  )
}

export default GithubContributionHeatmap

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

type DashboardCardProps = {
  title: string
  children?: ReactNode
  className?: string
  actionText?: string
  actionHref?: string
  chart?: ReactNode
}

export default function DashboardCard({
  title,
  children,
  className = "",
  actionText,
  actionHref,
  chart,
}: DashboardCardProps) {
  const router = useRouter()

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base">{title}</CardTitle>
        {actionText && actionHref && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(actionHref)}
          >
            {actionText}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {chart ? (
          <div className="h-60">{chart}</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

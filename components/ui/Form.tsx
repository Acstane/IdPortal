import { LoginFlow, RegistrationFlow, UiNode, UiNodeTypeEnum } from "@ory/kratos-client"
import { useState } from "react"
import { Input } from "./Input"

export function Form({ flow }: { flow: (LoginFlow | RegistrationFlow) }) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(
      flow.ui.nodes
        .filter((n: any) => n.type === UiNodeTypeEnum.Input)
        .map((n: any) => {
          const attrs = n.attributes
          return [attrs.name, attrs.value ?? ""]
        })
    )
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form method={flow.ui.method} action={flow.ui.action}>
    <pre>
        {JSON.stringify(form, null, 2)}
    </pre>
      {flow.ui.nodes.map((node: any) => {
        if (node.type === UiNodeTypeEnum.Input) {
          const attrs = node.attributes
          return (
            <div key={attrs.name}>
                <Input
                    key={(node.attributes as any).name}
                    node={node}
                    value={form[(node.attributes as any).name] ?? ""}
                    onChange={handleChange}
                />
            </div>
          )
        }
        return null
      })}
    </form>
  )
}

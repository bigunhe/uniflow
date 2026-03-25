"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "rgba(15, 20, 30, 0.95)",
          "--normal-border": "rgba(255,255,255,0.1)",
          "--normal-text": "rgba(255,255,255,0.9)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

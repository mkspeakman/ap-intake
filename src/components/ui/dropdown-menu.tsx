import * as React from "react"

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean }
>(({ className, children, open, ...props }, ref) => {
  return open ? (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  ) : null
})
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuItem }
